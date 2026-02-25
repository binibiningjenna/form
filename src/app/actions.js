"use server";

/**
 * Server Action to handle lead submission directly to both your custom CRM 
 * and Mailchimp, completely bypassing Make.com.
 */
export async function submitLead(formData) {
    const { fullName, email, phone, company, interestedService } = formData;

    // Configuration
    const CRM_WEBHOOK_URL = process.env.CRM_WEBHOOK_URL;
    const MC_API_KEY = process.env.MAILCHIMP_API_KEY;
    const MC_LIST_ID = process.env.MAILCHIMP_LIST_ID;

    // Track success of different branches
    let crmSuccess = false;
    let mailchimpSuccess = false;

    // 1. Post to your Custom CRM Webhook
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
                    notes: `Interested in: ${interestedService}`,
                    source: "Kasalang Tagaytay",
                }),
            });
            crmSuccess = crmResponse.ok;
            if (crmSuccess) console.log("Direct CRM Sync: Success");
        } catch (err) {
            console.error("Direct CRM Sync Error:", err);
        }
    } else {
        console.warn("CRM_WEBHOOK_URL is missing.");
    }

    // 2. Post to Mailchimp API
    if (MC_API_KEY && MC_LIST_ID) {
        try {
            const DATACENTER = MC_API_KEY.split("-")[1];
            const mcUrl = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${MC_LIST_ID}/members`;

            const mcResponse = await fetch(mcUrl, {
                method: "POST",
                headers: {
                    Authorization: `apikey ${MC_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email_address: email,
                    status: "subscribed",
                    merge_fields: {
                        FNAME: fullName.split(" ")[0],
                        LNAME: fullName.split(" ").slice(1).join(" ") || "",
                        COMPANY: company,
                        PHONE: phone,
                    },
                    // Tagged with general lead tag + the specific service (formatted for tags)
                    tags: ["Website_Lead", interestedService.replace(/\s+/g, "_")]
                }),
            });

            const mcResult = await mcResponse.json();

            // Success if member created (200/201) OR if they already exist
            mailchimpSuccess = mcResponse.ok || mcResult.title === "Member Exists";
            if (mailchimpSuccess) console.log("Direct Mailchimp Sync: Success");
        } catch (err) {
            console.error("Direct Mailchimp Sync Error:", err);
        }
    } else {
        console.warn("Mailchimp credentials missing.");
    }

    // Final result to the UI
    if (crmSuccess || mailchimpSuccess) {
        return { success: true };
    } else {
        return { success: false, error: "Submission failed. Please check your credentials." };
    }
}
