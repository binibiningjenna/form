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
    const GOOGLE_SHEET_WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL;

    // 1. CRM Sync Task (Parallel)
    const crmTask = (async () => {
        if (!CRM_WEBHOOK_URL) return false;
        try {
            const res = await fetchWithRetry(CRM_WEBHOOK_URL, {
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
            }, 1, 6000); // 1 retry, 6s timeout
            return res.ok;
        } catch (e) {
            console.error("CRM Task Error:", e.message);
            return false;
        }
    })();

    // 2. Brevo Sync Task (Parallel)
    const brevoTask = (async () => {
        if (!BREVO_API_KEY || !BREVO_LIST_ID) return { success: false };
        try {
            const nameParts = fullName.split(" ");
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(" ") || "-";

            const res = await fetchWithRetry("https://api.brevo.com/v3/contacts", {
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
                        FULLNAME: fullName,
                        COMPANY: company,
                        PHONE: phone,
                        INTERESTED_SERVICE: interestedService,
                        BOOKING_STATUS: bookingStatus || "pending"
                    },
                    listIds: [BREVO_LIST_ID],
                    updateEnabled: true
                }),
            }, 1, 10000); // 1 retry, 10s timeout

            if (res.ok) return { success: true };

            const error = await res.json();
            if (error.code === 'duplicate_parameter' || error.message?.includes('PHONE')) {
                return {
                    success: false,
                    field: "phone",
                    error: "This phone number is already registered. Please use a different one."
                };
            }
            return { success: false };
        } catch (e) {
            console.error("Brevo Task Error:", e.message);
            return { success: false };
        }
    })();

    // 3. Google Sheets Sync Task (Parallel backup)
    // We declare this but DO NOT await it in the Promise.all below. 
    // This allows it to run in the background (fire-and-forget) without slowing down the user's loading screen.
    const sheetTask = (async () => {
        if (!GOOGLE_SHEET_WEBHOOK_URL) return;
        try {
            await fetchWithRetry(GOOGLE_SHEET_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Name: fullName,
                    Email: email,
                    Phone: phone,
                    Company: company,
                    Service: interestedService,
                    Status: bookingStatus || "pending",
                    Source: "Kasalang Tagaytay",
                    Date: new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })
                }),
            }, 1, 5000);
        } catch (e) {
            console.error("Sheet Task Error:", e.message);
        }
    })();

    // Execute only CRM and Brevo in parallel so the user isn't forced to wait for Google Sheets
    const [crmOk, brevoResult] = await Promise.all([crmTask, brevoTask]);

    // Handle results
    if (brevoResult.field) {
        return brevoResult; // Pass back field error (e.g. duplicate phone)
    }

    if (crmOk || brevoResult.success) {
        if (crmOk) console.log("Direct CRM Sync: Parallel Success");
        if (brevoResult.success) console.log("Direct Brevo Sync: Parallel Success");

        // Auto-send the Day 0 transactional email to guarantee Primary Inbox delivery
        try {
            await resendBookingEmail(email, fullName);
            console.log("Day 0 Transactional Email dispatched.");
        } catch (err) {
            console.error("Failed to auto-send Day 0 email:", err);
        }

        return { success: true };
    }

    return { success: false, error: "Submission failed. Please check your internet connection." };
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

/**
 * Resends the booking email via Brevo Transactional Email.
 * Requires BREVO_TEMPLATE_ID to be set in the .env file.
 */
export async function resendBookingEmail(email, name) {
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_TEMPLATE_ID = parseInt(process.env.BREVO_TEMPLATE_ID || "0");

    if (!BREVO_API_KEY) return { success: false, error: "API Key missing" };
    if (!BREVO_TEMPLATE_ID) return { success: false, error: "Template ID is missing. Please configure BREVO_TEMPLATE_ID." };

    try {
        const brevoUrl = "https://api.brevo.com/v3/smtp/email";

        // Determine payload
        const payload = {
            to: [{ email: email, name: name }],
            templateId: BREVO_TEMPLATE_ID,
            params: {
                FIRSTNAME: name,
                FULLNAME: name,
            }
        };

        // Add CC if configured in environment variables (comma-separated for multiple)
        if (process.env.BREVO_CC_EMAIL) {
            const parsedCcs = process.env.BREVO_CC_EMAIL
                .split(',')
                .map(e => {
                    // strip literal quotes and trim
                    let cleanEmail = e.replace(/['"]/g, '').trim();
                    return { email: cleanEmail };
                })
                .filter(e => e.email);

            if (parsedCcs.length > 0) {
                payload.cc = parsedCcs;
            }
        }

        const response = await fetchWithRetry(brevoUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": BREVO_API_KEY,
            },
            body: JSON.stringify(payload),
        }, 1, 8000);

        if (response.ok) {
            console.log(`Resend Email Triggered: ${email} for template ${BREVO_TEMPLATE_ID}`);
            return { success: true };
        } else {
            const errData = await response.json();
            console.error("Brevo Resend Error:", errData);
            return { success: false, error: errData.message };
        }

    } catch (err) {
        console.error("Resend Email Error:", err.message);
        return { success: false, error: err.message };
    }
}
