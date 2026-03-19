import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Role from "@/models/Role";

export async function PUT(req, { params }) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const body = await req.json();
        const { name, description, permissions } = body;

        const role = await Role.findById(id);

        if (!role) {
            return NextResponse.json(
                { success: false, message: "Role not found" },
                { status: 404 }
            );
        }

        // Prevent modifying system roles' critical properties if needed, 
        // but usually permissions can be updated.
        // Let's allow updating everything for now, but maybe block name change for system roles if strict.

        if (name) role.name = name;
        if (description !== undefined) role.description = description;
        if (permissions) role.permissions = permissions;

        await role.save();

        return NextResponse.json({
            success: true,
            message: "Role updated successfully",
            data: role,
        });
    } catch (error) {
        console.error("Role Update Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        await connectToDatabase();
        const { id } = await params; // Awaiting params for Next.js 15+ compatibility if needed, works in 14 too

        const role = await Role.findById(id);

        if (!role) {
            return NextResponse.json(
                { success: false, message: "Role not found" },
                { status: 404 }
            );
        }



        // Optional: Check if any users are assigned to this role before deleting
        // const User = mongoose.models.User || mongoose.model("User");
        // const assignedUsers = await User.countDocuments({ roleId: id });
        // if (assignedUsers > 0) {
        //   return NextResponse.json({ success: false, message: "Cannot delete role assigned to users" }, { status: 400 });
        // }

        await Role.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: "Role deleted successfully",
        });
    } catch (error) {
        console.error("Role Delete Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
