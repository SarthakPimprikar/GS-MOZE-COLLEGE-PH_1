import { connectToDatabase } from "../../../lib/mongoose";
import featureSchema from "../../models/featureSchema";

export async function GET(req) {
    try {
        await connectToDatabase();
        let features = await featureSchema.find().sort({ order: 1 });

        if (!features || features.length === 0) {
            const defaultFeatures = [
                { icon: "Globe", title: "Online Admissions", description: "Digital application process document verification" },
                { icon: "Fingerprint", title: "Smart Attendance", description: "Biometric & facial recognition integration" },
                { icon: "MessageSquare", title: "SMS & Email Alert", description: "Automated notifications for all stakeholders" },
                { icon: "CalendarRange", title: "AI Timetable Scheduling", description: "Conflict-free scheduling with optimization" },
                { icon: "ClipboardList", title: "Exam Management", description: "Complete examination lifecycle handling" },
                { icon: "Users2", title: "Faculty Management", description: "Automated notifications for all stakeholders" },
                { icon: "CreditCard", title: "Fee Automation", description: "Online payments with auto-reconciliation" },
                { icon: "BarChart3", title: "Lab Analytics", description: "Utilization reports & resource planning" },
                { icon: "Building", title: "Hostel Management", description: "Room allotment & mess management" },
                { icon: "BriefcaseBusiness", title: "Placement Cell", description: "Company relations & student placements" },
                { icon: "FileCheck", title: "Accreditation Reports", description: "Ready-to-submit AICTE/NAAC documents" },
                { icon: "FileCheck", title: "Custom Modules", description: "Tailored solutions for unique needs" },
            ];

            features = await featureSchema.insertMany(defaultFeatures);
        }

        return new Response(JSON.stringify({ features }), { status: 200 });
    } catch (error) {
        console.error("Error fetching features:", error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectToDatabase();
        const { title, description, icon } = await req.json();

        if (!title || !description || !icon) {
            return new Response(
                JSON.stringify({ message: "Missing required fields" }),
                { status: 400 }
            );
        }

        const lastFeature = await featureSchema.findOne().sort({ order: -1 });
        const order = lastFeature ? lastFeature.order + 1 : 0;

        const newFeature = await featureSchema.create({
            title,
            description,
            icon,
            order,
        });

        return new Response(
            JSON.stringify({
                message: "Feature created successfully",
                feature: newFeature,
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating feature:", error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectToDatabase();
        const { id, title, description, icon } = await req.json();

        if (!id || !title || !description || !icon) {
            return new Response(
                JSON.stringify({ message: "Missing required fields" }),
                { status: 400 }
            );
        }

        const updatedFeature = await featureSchema.findByIdAndUpdate(
            id,
            { title, description, icon },
            { new: true }
        );

        if (!updatedFeature) {
            return new Response(
                JSON.stringify({ message: "Feature not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({
                message: "Feature updated successfully",
                feature: updatedFeature,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating feature:", error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return new Response(
                JSON.stringify({ message: "Missing feature ID" }),
                { status: 400 }
            );
        }

        const deletedFeature = await featureSchema.findByIdAndDelete(id);

        if (!deletedFeature) {
            return new Response(
                JSON.stringify({ message: "Feature not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ message: "Feature deleted successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting feature:", error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}
