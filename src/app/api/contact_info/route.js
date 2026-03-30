import { connectToDatabase } from "../../../lib/mongoose";
import contactInfoSchema from "../../models/contactInfoSchema";

export async function GET(req) {
    try {
        await connectToDatabase();
        let contactInfo = await contactInfoSchema.findOne();

        if (!contactInfo) {
            // Seed default data if not exists
            contactInfo = await contactInfoSchema.create({
                email: "admin@techedutech.com",
                phone1: "+91 8605112331",
                phone2: "+91 8408080231",
                addressLine1: "Office Number 101, Nirman Ajinkatara",
                addressLine2: "Adjacent to Sinhagad Science College",
                addressLine3: "Vadgaon, Pune - 411041",
                businessHours: "Monday - Friday: 10AM - 7PM",
                googleMapUrl: "https://www.google.com/maps?q=Office%20Number%20101%20Nirman%20Ajinkatara%20Vadgaon%20Pune%20411041&output=embed"
            });
        }

        return new Response(JSON.stringify({ contactInfo }), { status: 200 });
    } catch (error) {
        console.error("Error fetching contact info:", error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectToDatabase();
        const data = await req.json();

        // Upsert: update the first document found, or create if none exists.
        // Since we usually only want one contact info block for the site.
        const updatedInfo = await contactInfoSchema.findOneAndUpdate(
            {}, // filter: match any document (or we could ensure singleton in other ways)
            data,
            { new: true, upsert: true } // options: return updated, create if missing
        );

        return new Response(
            JSON.stringify({
                message: "Contact info updated successfully",
                contactInfo: updatedInfo,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating contact info:", error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}
