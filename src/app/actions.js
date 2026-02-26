"use server";

/**
 * Helper to fetch with retry logic
 * We keep timeouts shorter for the CRM since it seems to be dragging the UI down.
 */
async function fetchWithRetry(url, options, retries = 1, timeoutMs = 10000) {
    for (let i = 0; i <= retries; i++) {
        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeoutMs);

            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(id);
            return response;
        } catch (err) {
            if (i === retries) throw err;
            console.warn(`Fetch to ${url} failed (attempt ${i + 1}/${retries + 1}), retrying in 1s...`);
            await new Promise(res => setTimeout(res, 1000));
        }
    }
}

/**
 * Server Action to handle lead submission directly to both your custom CRM 
 * and Brevo (formerly Sendinblue).
 */
export async function submitLead(formData) {
    const { fullName, email, phone, company, interestedService, bookingStatus } = formData;

    // Configuration
    const CRM_WEBHOOK_URL = process.env.CRM_WEBHOOK_URL;
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_LIST_ID = parseInt(process.env.BREVO_LIST_ID || "0");

    // Track success of different branches
    let crmSuccess = false;
    let brevoSuccess = false;

    // 1. Post to your Custom CRM Webhook (Kasalang Tagaytay source)
    // We use a shorter timeout for this because we don't want to hang the UI for 50s.
    if (CRM_WEBHOOK_URL) {
        try {
            const crmResponse = await fetchWithRetry(CRM_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: fullName,
                    email: email,
                    phone: phone,
                    company: company,
                    notes: `Interested in: ${interestedService}${bookingStatus ? `\nBooking Status: ${bookingStatus}` : ""}`,
                    source: "Kasalang Tagaytay",
                }),
            }, 1, 8000); // 1 retry, 8s timeout

            crmSuccess = crmResponse.ok;
            if (crmSuccess) console.log("Direct CRM Sync: Success");
        } catch (err) {
            console.error("Direct CRM Sync Error (Timed out or unreachable):", err.message);
        }
    }

    // 2. Post to Brevo API
    if (BREVO_API_KEY && BREVO_LIST_ID) {
        try {
            const brevoUrl = "https://api.brevo.com/v3/contacts";
            const nameParts = fullName.split(" ");
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(" ") || "-";

            const response = await fetchWithRetry(brevoUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "api-key": BREVO_API_KEY,
                },
                body: JSON.stringify({
                    email: email,
                    attributes: {
                        FIRSTNAME: firstName,
                        LASTNAME: lastName,
                        COMPANY: company,
                        PHONE: phone,
                        INTERESTED_SERVICE: interestedService,
                        BOOKING_STATUS: bookingStatus || "pending"
                    },
                    listIds: [BREVO_LIST_ID],
                    updateEnabled: true
                }),
            }, 2, 12000);

            if (response.ok) {
                brevoSuccess = true;
                console.log("Direct Brevo Sync: Success");
            } else {
                const brevoError = await response.json();
                console.error("Brevo API Response Error:", brevoError);

                // If it's a duplicate PHONE error (unlikely) or parameter error
                if (brevoError.code === 'duplicate_parameter' || brevoError.message?.includes('PHONE')) {
                    return {
                        success: false,
                        error: "This phone number is already registered. Please use a different one.",
                        field: "phone"
                    };
                }
            }
        } catch (err) {
            console.error("Direct Brevo Connectivity Error:", err.message);
        }
    }

    // Final result to the UI
    // If either one worked (CRM or Brevo), we tell the user "Success" 
    // so they can move on at the expo.
    if (crmSuccess || brevoSuccess) {
        return { success: true };
    } else {
        // Even if both fail, if it was a network timeout, we might want to return success 
        // anyway and log it, but let's be honest for now.
        return { success: false, error: "Submission failed. Please check your internet connection." };
    }
}

/**
 * Updates the booking status in Brevo.
 */
export async function updateBookingStatus(email, status) {
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    if (!BREVO_API_KEY) return { success: false, error: "API Key missing" };

    try {
        const brevoUrl = `https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`;

        const response = await fetchWithRetry(brevoUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "api-key": BREVO_API_KEY,
            },
            body: JSON.stringify({
                attributes: { BOOKING_STATUS: status }
            }),
        }, 1, 8000);

        return { success: response.ok };
    } catch (err) {
        console.error("Update Booking Status Error:", err.message);
        return { success: false, error: err.message };
    }
}
