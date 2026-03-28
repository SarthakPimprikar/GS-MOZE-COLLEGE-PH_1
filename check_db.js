const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://harshladukar:harshal@cluster2.htn2ymn.mongodb.net/test";

async function checkEnquiries() {
    try {
        await mongoose.connect(MONGODB_URI);
        const db = mongoose.connection.db;
        const enquiries = await db.collection('enquiries').find({}).toArray();
        
        console.log(`Count: ${enquiries.length}`);
        enquiries.forEach(e => {
            console.log(`ID: ${e._id}, counsellorId: ${e.counsellorId}, status: ${e.status}, Source: ${e.source}`);
        });
        
        await mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
    }
}

checkEnquiries();
