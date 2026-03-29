import { connectToDatabase } from "../../../lib/mongoose";
import contactInfoSchema from "../../models/contactInfoSchema";

export async function GET(req) {
    try {
        await connectToDatabase();
        let contactInfo = await contactInfoSchema.findOne();

        if (!contactInfo) {
            // Seed default data if not exists
            contactInfo = await contactInfoSchema.create({
                email: "info@gsmozecollege.edu.in",
                phone1: "+91 20 2661 2345",
                phone2: "+91 98811 00000",
                addressLine1: "G.S. Moze College Campus",
                addressLine2: "Wadia Road, Yerawada",
                addressLine3: "Pune, Maharashtra - 411006",
                businessHours: "Monday - Saturday: 9AM - 5PM",
                googleMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d121059.0436006745!2d73.78056580922438!3d18.5247656247654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c0603f909191%3A0x6b4fb24e4d6d84f1!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1711690000000!5m2!1sen!2sin"
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
