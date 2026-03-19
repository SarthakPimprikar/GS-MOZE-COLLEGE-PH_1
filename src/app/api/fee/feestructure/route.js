import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import FeeStructure from "@/app/models/feeStructureSchema";
import Student from "@/app/models/studentSchema";
import academic from "@/app/models/academicSchema";

export async function GET(req) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    const branch = searchParams.get('branch');
    const programType = searchParams.get('programType');
    const year = searchParams.get('year');
    
    // If studentId is provided, find specific fee structure for that student
    if (studentId) {
      // For now, we don't have Student model active, so return error
      return NextResponse.json({
        success: false,
        error: 'Student functionality not available. Please use branch, programType, and year parameters instead.'
      }, { status: 400 });
    }
    
    // If branch, programType, and year are provided (for enquiries)
    if (branch && programType && year) {
      console.log('Searching fee structure for enquiry:', { branch, programType, year });
      
      // Find fee structure for this enquiry
      let feeStructure = await FeeStructure.findOne({
        programType: programType,
        departmentName: branch,
        year: year,
        category: 'general'
      });

      // If not found, try any matching record
      if (!feeStructure) {
        feeStructure = await FeeStructure.findOne({
          programType: programType,
          departmentName: branch
        });
      }

      if (!feeStructure) {
        console.log('No fee structure found for:', { branch, programType, year });
        return NextResponse.json({
          success: false,
          error: 'Fee structure not found for this enquiry'
        }, { status: 404 });
      }

      console.log('Found fee structure:', feeStructure);
      return NextResponse.json({
        success: true,
        feeStructure: feeStructure
      });
    }
    
    // Original logic for dropdown values
    const academics = await academic.find({ isActive: true }).lean();
    const programTypes = [
      ...new Set(academics.map((a) => a.programType).filter(Boolean)),
    ].map((pt, index) => ({ id: index + 1, name: pt }));
    const departments = [
      ...new Set(academics.map((a) => a.department).filter(Boolean)),
    ].map((dept, index) => ({ id: index + 1, name: dept }));
    let yearCollect = [];
    academics.forEach((a) => {
      if (a.years) {
        a.years.forEach((y) => {
          if (y.year) yearCollect.push(y.year);
        });
      }
    });
    const years = [...new Set(yearCollect)].map((yr, index) => ({
      id: index + 1,
      name: yr,
    }));
    // Fetch all saved fee structures
    const feeStructures = await FeeStructure.find().lean();
    return NextResponse.json({
      success: true,
      programTypes,
      departments,
      years,
      feeStructures,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Fee structure ID is required" },
        { status: 400 }
      );
    }
    const deleted = await FeeStructure.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Fee structure not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, message: "Fee structure deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete fee structure" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    console.log("PUT request received for ID:", id);
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Fee structure ID is required" },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await req.json();
      console.log("Received update payload:", body);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }
    
    const {
      programType,
      departmentName,
      year,
      caste,
      category,
      yearWiseFeeStructure,
      scholarshipParticular,
      feesFromStudent = [],
      feesFromSocialWelfare = [],
    } = body;

    // Validate required fields
    if (!programType || !departmentName || !year) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate at least one fee item
    if (feesFromStudent.length === 0 && feesFromSocialWelfare.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one fee item is required" },
        { status: 400 }
      );
    }

    // Validate fee items
    const validateFeeItems = (items, type) =>
      items.every(
        (item) =>
          item.componentName &&
          typeof item.amount === "number" &&
          item.amount >= 0
      );

    if (
      (feesFromStudent.length > 0 && !validateFeeItems(feesFromStudent, "student")) ||
      (feesFromSocialWelfare.length > 0 && !validateFeeItems(feesFromSocialWelfare, "welfare"))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid fee items provided" },
        { status: 400 }
      );
    }

    // Calculate totals automatically
    const calculatedStudentTotal = feesFromStudent.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );
    
    const calculatedWelfareTotal = feesFromSocialWelfare.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );
    
    const calculatedTotal = calculatedStudentTotal + calculatedWelfareTotal;
    
    console.log('Calculated totals:', {
      studentTotal: calculatedStudentTotal,
      welfareTotal: calculatedWelfareTotal,
      total: calculatedTotal
    });

    const updatedFee = await FeeStructure.findByIdAndUpdate(
      id,
      {
        programType,
        departmentName,
        year,
        caste: caste || "general",
        category: category || "regular",
        yearWiseFeeStructure: yearWiseFeeStructure || "annual",
        scholarshipParticular: scholarshipParticular || "none",
        feesFromStudent,
        feesFromSocialWelfare,
        totalStudentFees: calculatedStudentTotal, // Use calculated value
        totalSocialWelfareFees: calculatedWelfareTotal, // Use calculated value
        totalFees: calculatedTotal, // Use calculated value
      },
      { new: true, runValidators: true }
    );

    if (!updatedFee) {
      return NextResponse.json(
        { success: false, error: "Fee structure not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Fee structure updated successfully", data: updatedFee },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating fee:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Fee structure already exists for this combination" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    console.log("Received payload:", body);
    const {
      programType,
      departmentName,
      year,
      caste,
      category,
      yearWiseFeeStructure,
      scholarshipParticular,
      feesFromStudent = [],
      feesFromSocialWelfare = [],
    } = body;

    // Validate required fields
    if (!programType || !departmentName || !year) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate at least one fee item
    if (feesFromStudent.length === 0 && feesFromSocialWelfare.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one fee item is required" },
        { status: 400 }
      );
    }

    // Validate fee items
    const validateFeeItems = (items, type) =>
      items.every(
        (item) =>
          item.componentName &&
          typeof item.amount === "number" &&
          item.amount >= 0
      );

    if (
      (feesFromStudent.length > 0 && !validateFeeItems(feesFromStudent, "student")) ||
      (feesFromSocialWelfare.length > 0 && !validateFeeItems(feesFromSocialWelfare, "welfare"))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid fee items provided" },
        { status: 400 }
      );
    }

    // Calculate totals automatically for new fee structure
    const calculatedStudentTotal = feesFromStudent.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );
    
    const calculatedWelfareTotal = feesFromSocialWelfare.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );
    
    const calculatedTotal = calculatedStudentTotal + calculatedWelfareTotal;
    
    console.log('New fee structure totals:', {
      studentTotal: calculatedStudentTotal,
      welfareTotal: calculatedWelfareTotal,
      total: calculatedTotal
    });

    const newFee = await FeeStructure.create({
      programType,
      departmentName,
      year,
      caste: caste || "general",
      category: category || "regular",
      yearWiseFeeStructure: yearWiseFeeStructure || "annual",
      scholarshipParticular: scholarshipParticular || "none",
      feesFromStudent,
      feesFromSocialWelfare,
      totalStudentFees: calculatedStudentTotal, // Use calculated value
      totalSocialWelfareFees: calculatedWelfareTotal, // Use calculated value
      totalFees: calculatedTotal, // Use calculated value
    });

    return NextResponse.json(
      { success: true, message: "Fee structure saved successfully", data: newFee },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving fee:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Fee structure already exists for this combination" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}