"use server";

/**
 * Server Action to handle lead submission directly to both your custom CRM 
 * and MailerLite, completely bypassing Make.com.
 */
export async function submitLead(formData) {
    const { fullName, email, phone, company, interestedService } = formData;

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
                    notes: `Interested in: ${interestedService}\nLead Source: Kasalang Tagaytay`,
                    source: "Kasalang Tagaytay",
                    lead_source: "Kasalang Tagaytay",
                    leadSource: "Kasalang Tagaytay",
                    "lead-sources": "Kasalang Tagaytay",
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
                    },
                    // Adding a tag helps trigger automation workflows in MailerLite
                    tags: ["Website_Lead", interestedService.replace(/\s+/g, "_")]
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
