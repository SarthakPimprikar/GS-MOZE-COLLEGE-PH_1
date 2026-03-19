import { connectToDatabase } from "../../../lib/mongoose";
import moduleSchema from "../../models/moduleSchema";

export async function GET(req) {
    try {
        await connectToDatabase();
        let modules = await moduleSchema.find().sort({ order: 1 });

        if (!modules || modules.length === 0) {
            const defaultModules = [
                { icon: "BookOpenText", title: "Admissions", description: "Online application & enrollment" },
                { icon: "GraduationCap", title: "Academics", description: "Curriculum & course management" },
                { icon: "IndianRupee", title: "Fee Management", description: "Automated billing & receipts" },
                { icon: "Library", title: "Examination", description: "Scheduling & result processing" },
                { icon: "CalendarDays", title: "Timetable", description: "AI-powered scheduling" },
                { icon: "UserCog", title: "HR & Payroll", description: "Staff management & salary" },
                { icon: "ClipboardSignature", title: "Placement", description: "Recruitment lifecycle management" },
                { icon: "BarChart4", title: "Analytics", description: "Insights & reporting dashboard" },
                { icon: "FlaskConical", title: "Lab Management", description: "Resource & equipment tracking" },
                { icon: "Building2", title: "Hostel", description: "Room allocation & facilities" },
                { icon: "Briefcase", title: "Industry Collaboration", description: "MOUs & partnerships" },
                { icon: "FileSearch", title: "Accreditation", description: "NBA, NAAC & AICTE reports" }
            ];

            modules = await moduleSchema.insertMany(defaultModules);
        }

        return new Response(JSON.stringify({ modules }), { status: 200 });
    } catch (error) {
        console.error("Error fetching modules:", error);
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

        const lastModule = await moduleSchema.findOne().sort({ order: -1 });
        const order = lastModule ? lastModule.order + 1 : 0;

        const newModule = await moduleSchema.create({
            title,
            description,
            icon,
            order,
        });

        return new Response(
            JSON.stringify({
                message: "Module created successfully",
                module: newModule,
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating module:", error);
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

        const updatedModule = await moduleSchema.findByIdAndUpdate(
            id,
            { title, description, icon },
            { new: true }
        );

        if (!updatedModule) {
            return new Response(
                JSON.stringify({ message: "Module not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({
                message: "Module updated successfully",
                module: updatedModule,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating module:", error);
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
                JSON.stringify({ message: "Missing module ID" }),
                { status: 400 }
            );
        }

        const deletedModule = await moduleSchema.findByIdAndDelete(id);

        if (!deletedModule) {
            return new Response(
                JSON.stringify({ message: "Module not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ message: "Module deleted successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting module:", error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}
