import { connectToDatabase } from "../../../lib/mongoose";
import benefitSchema from "../../models/benefitSchema";

export async function GET(req) {
  try {
    await connectToDatabase();
    let benefits = await benefitSchema.find().sort({ order: 1 });

    if (!benefits || benefits.length === 0) {
      const defaultBenefits = [
        {
          icon: "Users",
          title: "Role-Based Access",
          description: "Granular permissions for Faculty, HOD, Lab Staff, and Admin",
        },
        {
          icon: "LineChart",
          title: "Real-Time Analytics",
          description: "Live dashboards with actionable insights",
        },
        {
          icon: "Folder",
          title: "Digital Document Hub",
          description: "Centralized repository with version control",
        },
        {
          icon: "CalendarCheck",
          title: "Academic Automation",
          description: "Automate labs, exams, and workshop workflows",
        },
        {
          icon: "CheckSquare",
          title: "Compliance Reports",
          description: "One-click AICTE, NAAC, and NBA reports",
        },
        {
          icon: "FileStack",
          title: "Placement Tracking",
          description: "Complete recruitment lifecycle management",
        },
        {
          icon: "ClipboardList",
          title: "Project Management",
          description: "Track research and student projects",
        },
        {
          icon: "ShieldCheck",
          title: "Quality Assurance",
          description: "Built-in checks for academic excellence",
        },
      ];

      benefits = await benefitSchema.insertMany(defaultBenefits);
    }

    return new Response(JSON.stringify({ benefits }), { status: 200 });
  } catch (error) {
    console.error("Error fetching benefits:", error);
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

    const updatedBenefit = await benefitSchema.findByIdAndUpdate(
      id,
      { title, description, icon },
      { new: true }
    );

    if (!updatedBenefit) {
      return new Response(
        JSON.stringify({ message: "Benefit not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Benefit updated successfully",
        benefit: updatedBenefit,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating benefit:", error);
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

    // Get the highest order to append to the end
    const lastBenefit = await benefitSchema.findOne().sort({ order: -1 });
    const order = lastBenefit ? lastBenefit.order + 1 : 0;

    const newBenefit = await benefitSchema.create({
      title,
      description,
      icon,
      order,
    });

    return new Response(
      JSON.stringify({
        message: "Benefit created successfully",
        benefit: newBenefit,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating benefit:", error);
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
        JSON.stringify({ message: "Missing benefit ID" }),
        { status: 400 }
      );
    }

    const deletedBenefit = await benefitSchema.findByIdAndDelete(id);

    if (!deletedBenefit) {
      return new Response(
        JSON.stringify({ message: "Benefit not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Benefit deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting benefit:", error);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
