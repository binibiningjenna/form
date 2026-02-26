"use server";

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
    if (CRM_WEBHOOK_URL) {
        try {
            const crmResponse = await fetch(CRM_WEBHOOK_URL, {
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
            });
            crmSuccess = crmResponse.ok;
            if (crmSuccess) console.log("Direct CRM Sync: Success");
        } catch (err) {
            console.error("Direct CRM Sync Error:", err);
        }
    }

    // 2. Post to Brevo API
    if (BREVO_API_KEY && BREVO_LIST_ID) {
        try {
            const brevoUrl = "https://api.brevo.com/v3/contacts";

            // Split name for Brevo defaults
            const nameParts = fullName.split(" ");
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(" ") || "-";

            const response = await fetch(brevoUrl, {
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
                        SMS: phone, // Brevo uses SMS field for phone numbers
                        INTERESTED_SERVICE: interestedService,
                        BOOKING_STATUS: bookingStatus || "pending"
                    },
                    listIds: [BREVO_LIST_ID],
                    updateEnabled: true // Updates contact if they already exist
                }),
            });

            if (response.ok) {
                brevoSuccess = true;
                console.log("Direct Brevo Sync: Success");
            } else {
                const brevoError = await response.json();
                console.error("Brevo API Error:", brevoError);
            }
        } catch (err) {
            console.error("Direct Brevo Sync Error:", err);
        }
    } else {
        console.warn("BREVO_API_KEY or BREVO_LIST_ID is missing.");
    }

    // Final result to the UI
    if (crmSuccess || brevoSuccess) {
        return { success: true };
    } else {
        return { success: false, error: "Submission failed. Please check your credentials." };
    }
}

/**
 * Updates the booking status for an existing lead in Brevo.
 */
export async function updateBookingStatus(email, status) {
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    if (!BREVO_API_KEY) return { success: false, error: "API Key missing" };

    try {
        const brevoUrl = `https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`;

        const response = await fetch(brevoUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "api-key": BREVO_API_KEY,
            },
            body: JSON.stringify({
                attributes: {
                    BOOKING_STATUS: status,
                }
            }),
        });

        if (response.ok) {
            console.log(`Brevo Status Update: ${email} marked as ${status}`);
        } else {
            const errData = await response.json();
            console.error("Brevo Update Error:", errData);
        }

        return { success: response.ok };
    } catch (err) {
        console.error("Update Booking Status Error:", err);
        return { success: false, error: err.message };
    }
}
