const mongoose = require("mongoose");

const MONGODB_URI = "mongodb+srv://harshladukar:harshal@cluster2.htn2ymn.mongodb.net/test";

const contactInfoSchema = new mongoose.Schema({
    email: String,
    phone1: String,
    phone2: String,
    addressLine1: String,
    addressLine2: String,
    addressLine3: String,
    businessHours: String,
    googleMapUrl: String
});

const ContactInfo = mongoose.models.ContactInfo || mongoose.model("ContactInfo", contactInfoSchema);

async function updateContact() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        const dummyData = {
            email: "info@gsmozecollege.edu.in",
            phone1: "+91 20 2661 2345",
            phone2: "+91 98811 00000",
            addressLine1: "G.S. Moze College Campus",
            addressLine2: "Wadia Road, Yerawada",
            addressLine3: "Pune, Maharashtra - 411006",
            businessHours: "Monday - Saturday: 9AM - 5PM",
            googleMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d121059.0436006745!2d73.78056580922438!3d18.5247656247654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c0603f909191%3A0x6b4fb24e4d6d84f1!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1711690000000!5m2!1sen!2sin"
        };

        const result = await ContactInfo.findOneAndUpdate({}, dummyData, { upsert: true, new: true });
        console.log("Updated record:", JSON.stringify(result, null, 2));

        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (err) {
        console.error("Error:", err);
    }
}

updateContact();
