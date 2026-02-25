"use server";

/**
 * Private helper to find or create a group ID by name in MailerLite.
 * In MailerLite Connect API, "tags" are managed via their "Groups" system.
 */
async function ensureGroup(groupName) {
    const ML_API_KEY = process.env.MAILERLITE_API_KEY;
    if (!ML_API_KEY) return null;

    try {
        // 1. Search for existing group
        const searchUrl = `https://connect.mailerlite.com/api/groups?filter[name]=${encodeURIComponent(groupName)}`;
        const searchRes = await fetch(searchUrl, {
            headers: { "Authorization": `Bearer ${ML_API_KEY}`, "Accept": "application/json" }
        });
        if (!searchRes.ok) return null;
        const searchData = await searchRes.json();

        if (searchData.data && searchData.data.length > 0) {
            return searchData.data[0].id;
        }

        // 2. Not found, create it
        const createUrl = `https://connect.mailerlite.com/api/groups`;
        const createRes = await fetch(createUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${ML_API_KEY}`,
            },
            body: JSON.stringify({ name: groupName })
        });
        if (!createRes.ok) return null;
        const createData = await createRes.json();
        return createData.data?.id || null;
    } catch (err) {
        console.error(`Error ensuring group ${groupName}:`, err);
        return null;
    }
}

/**
 * Server Action to handle lead submission directly to both your custom CRM 
 * and MailerLite, completely bypassing Make.com.
 */
export async function submitLead(formData) {
    const { fullName, email, phone, company, interestedService, bookingStatus } = formData;

    // Configuration
    const CRM_WEBHOOK_URL = process.env.CRM_WEBHOOK_URL;
    const ML_API_KEY = process.env.MAILERLITE_API_KEY;

    // Track success of different branches
    let crmSuccess = false;
    let mailerliteSuccess = false;

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

    // 2. Post to MailerLite API
    if (ML_API_KEY) {
        try {
            // MailerLite API URL for creating/updating a subscriber
            const mlUrl = `https://connect.mailerlite.com/api/subscribers`;

            const groups = ["180374262508422229"]; // Default: Kasalang Tagaytay Leads group

            // Add categorical groups (In MailerLite, these act as tags)
            const serviceGroup = await ensureGroup(interestedService);
            if (serviceGroup) groups.push(serviceGroup);

            if (bookingStatus) {
                const statusName = `Booking_${bookingStatus.charAt(0).toUpperCase() + bookingStatus.slice(1)}`;
                const statusGroup = await ensureGroup(statusName);
                if (statusGroup) groups.push(statusGroup);

                // DEFAULT BEHAVIOR: If they just answered the form (pending),
                // we automatically add them to the "Later" group so reminders
                // start immediately in case they close the browser.
                if (bookingStatus === "pending") {
                    const reminderGroup = await ensureGroup("Booking_Later");
                    if (reminderGroup) groups.push(reminderGroup);
                }
            }

            const mlResponse = await fetch(mlUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${ML_API_KEY}`,
                },
                body: JSON.stringify({
                    email: email,
                    fields: {
                        name: fullName.split(" ")[0],
                        last_name: fullName.split(" ").slice(1).join(" ") || "",
                        company: company,
                        phone: phone,
                        booking_status: bookingStatus || "pending",
                    },
                    groups: groups
                }),
            });

            if (mlResponse.ok) {
                mailerliteSuccess = true;
                console.log("Direct MailerLite Sync: Success");
            } else {
                const mlError = await mlResponse.json();
                console.error("MailerLite API Error:", mlError);
            }
        } catch (err) {
            console.error("Direct MailerLite Sync Error:", err);
        }
    } else {
        console.warn("MAILERLITE_API_KEY is missing.");
    }

    // Final result to the UI
    if (crmSuccess || mailerliteSuccess) {
        return { success: true };
    } else {
        return { success: false, error: "Submission failed. Please check your credentials." };
    }
}

/**
 * Updates the booking status for an existing lead in MailerLite.
 */
export async function updateBookingStatus(email, status) {
    const ML_API_KEY = process.env.MAILERLITE_API_KEY;
    if (!ML_API_KEY) return { success: false, error: "API Key missing" };

    try {
        const groupName = `Booking_${status.charAt(0).toUpperCase() + status.slice(1)}`;
        const groupId = await ensureGroup(groupName);

        const mlUrl = `https://connect.mailerlite.com/api/subscribers`;
        const response = await fetch(mlUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${ML_API_KEY}`,
            },
            body: JSON.stringify({
                email: email,
                fields: {
                    booking_status: status,
                },
                groups: groupId ? [groupId] : []
            }),
        });

        return { success: response.ok };
    } catch (err) {
        console.error("Update Booking Status Error:", err);
        return { success: false, error: err.message };
    }
}
