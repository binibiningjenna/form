import { NextResponse } from "next/server";
import { updateBookingStatus } from "../../../actions";

export async function GET() {
    return NextResponse.json({ success: true, message: "Cal.com Webhook is active and waiting for POST requests." });
}

export async function POST(request) {
    try {
        const payload = await request.json();

        // Cal.com sends 'BOOKING_CREATED' event
        if (payload.triggerEvent === "BOOKING_CREATED") {
            const email = payload.payload.attendees[0].email;
            const name = payload.payload.attendees[0].name;

            console.log(`Cal.com Webhook: User ${name} (${email}) booked!`);

            // Update Brevo status to 'booked' to stop reminders
            await updateBookingStatus(email, "booked");

            return NextResponse.json({ success: true, message: "Brevo updated" });
        }

        return NextResponse.json({ success: true, message: "Event ignored" });
    } catch (err) {
        console.error("Cal.com Webhook Error:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
