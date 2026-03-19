import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Role from "@/models/Role";

// Helper to handle errors consistently
const handleError = (error) => {
    console.error("Role API Error:", error);
    return NextResponse.json(
        { success: false, message: error.message || "Internal Server Error" },
        { status: 500 }
    );
};

export async function GET() {
    try {
        await connectToDatabase();
        const roles = await Role.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, count: roles.length, data: roles });
    } catch (error) {
        return handleError(error);
    }
}

export async function POST(req) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const { name, description, permissions } = body;

        // Basic Validation
        if (!name) {
            return NextResponse.json(
                { success: false, message: "Role name is required" },
                { status: 400 }
            );
        }

        // Check if role exists
        const existingRole = await Role.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existingRole) {
            return NextResponse.json(
                { success: false, message: "Role with this name already exists" },
                { status: 409 }
            );
        }

        const newRole = await Role.create({
            name,
            description,
            permissions: permissions || [],
            isSystem: false, // Created via API is usually not system/hardcoded default
        });

        return NextResponse.json(
            { success: true, message: "Role created successfully", data: newRole },
            { status: 201 }
        );
    } catch (error) {
        return handleError(error);
    }
}
