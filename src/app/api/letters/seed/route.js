import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import LetterTemplate from "@/app/models/letterTemplateSchema";

const defaultTemplates = [
  {
    name: "Bonafide Certificate",
    description: "Standard bonafide certificate for students.",
    category: "Student",
    placeholders: ["{{student_name}}", "{{student_id}}", "{{branch}}", "{{current_year}}", "{{academic_year}}", "{{date}}"],
    content: `
      <div style="font-family: 'Times New Roman', serif; padding: 50px; border: 10px double #1a237e; min-height: 800px; position: relative; color: #1a237e;">
        <div style="text-align: center;">
          <h1 style="margin: 0; font-size: 32px; font-weight: 900; text-transform: uppercase;">GS Moze College of Engineering</h1>
          <p style="margin: 5px 0; font-size: 14px; font-weight: bold;">Wagholi, Pune - 412207</p>
          <hr style="border: 2px solid #1a237e; margin: 20px 0;">
        </div>
        
        <div style="text-align: center; margin: 50px 0;">
          <h2 style="text-decoration: underline; font-size: 24px; text-transform: uppercase;">Bonafide Certificate</h2>
        </div>
        
        <div style="line-height: 2; font-size: 18px; text-align: justify; margin-bottom: 50px;">
          <p>This is to certify that Mr./Ms. <strong style="border-bottom: 1px dotted #000;">{{student_name}}</strong> 
          having unique ID <strong style="border-bottom: 1px dotted #000;">{{student_id}}</strong> 
          is a bonafide student of this institute, studying in <strong style="border-bottom: 1px dotted #000;">{{current_year}}</strong> 
          of the <strong style="border-bottom: 1px dotted #000;">{{branch}}</strong> department, during the academic year 
          <strong style="border-bottom: 1px dotted #000;">{{academic_year}}</strong>.</p>
          
          <p>This certificate is issued at his/her request for administrative purposes.</p>
        </div>
        
        <div style="margin-top: 100px; display: flex; justify-content: space-between;">
          <div style="text-align: center;">
            <p>Date: {{date}}</p>
            <p>Place: Pune</p>
          </div>
          <div style="text-align: center; border-top: 1px solid #1a237e; padding-top: 10px; width: 200px;">
            <p style="font-weight: bold; margin: 0;">Principal / Registrar</p>
            <p style="font-size: 12px; margin: 0;">GS Moze College</p>
          </div>
        </div>
      </div>
    `
  },
  {
    name: "Offer Letter",
    description: "Employment offer letter for staff/teachers.",
    category: "Staff",
    placeholders: ["{{candidate_name}}", "{{position}}", "{{department}}", "{{joining_date}}", "{{salary}}", "{{date}}"],
    content: `
      <div style="font-family: Arial, sans-serif; padding: 60px; color: #333; line-height: 1.6;">
        <div style="text-align: right; margin-bottom: 40px;">
          <p>Date: {{date}}</p>
          <p>Ref: GSM/HR/OFF/{{candidate_name}}</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <p>To,</p>
          <p><strong>{{candidate_name}}</strong></p>
        </div>
        
        <h2 style="text-align: center; margin-bottom: 30px; text-transform: uppercase;">Letter of Appointment</h2>
        
        <p>Dear {{candidate_name}},</p>
        
        <p>With reference to your interview and subsequent discussions, we are pleased to offer you the position of 
        <strong>{{position}}</strong> in the <strong>{{department}}</strong> department at GS Moze College of Engineering.</p>
        
        <h3>Terms and Conditions:</h3>
        <ul>
          <li><strong>Joining Date:</strong> Your appointment will be effective from {{joining_date}}.</li>
          <li><strong>Compensation:</strong> Your annual CTC will be {{salary}} per annum.</li>
          <li><strong>Probation:</strong> You will be under probation for a period of six months.</li>
        </ul>
        
        <p>We look forward to having you on board as part of our specialized academic team.</p>
        
        <div style="margin-top: 60px;">
          <p>Sincerely,</p>
          <br><br>
          <p><strong>Director / Chairman</strong></p>
          <p>GS Moze College of Engineering</p>
        </div>
      </div>
    `
  },
  {
    name: "Leaving Certificate",
    description: "Standard student leaving certificate (LC).",
    category: "Student",
    placeholders: ["{{student_name}}", "{{prn}}", "{{branch}}", "{{admission_date}}", "{{leaving_date}}", "{{reason}}"],
    content: `
      <div style="font-family: 'Verdana', sans-serif; padding: 40px; border: 4px solid #000; min-height: 700px; background-color: #fffaf0;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="margin: 0;">GS MOZE COLLEGE OF ENGINEERING</h1>
          <p>Recognized by DTE, Govt of Maharashtra</p>
          <hr>
        </div>
        
        <h2 style="text-align: center;">TRANSFER / LEAVING CERTIFICATE</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 30px; font-size: 16px;">
          <tr><td style="padding: 15px; border: 1px solid #ddd; width: 40%;">Student Name</td><td style="padding: 15px; border: 1px solid #ddd;"><strong>{{student_name}}</strong></td></tr>
          <tr><td style="padding: 15px; border: 1px solid #ddd;">PRN Number</td><td style="padding: 15px; border: 1px solid #ddd;">{{prn}}</td></tr>
          <tr><td style="padding: 15px; border: 1px solid #ddd;">Department / Branch</td><td style="padding: 15px; border: 1px solid #ddd;">{{branch}}</td></tr>
          <tr><td style="padding: 15px; border: 1px solid #ddd;">Date of Admission</td><td style="padding: 15px; border: 1px solid #ddd;">{{admission_date}}</td></tr>
          <tr><td style="padding: 15px; border: 1px solid #ddd;">Date of Leaving</td><td style="padding: 15px; border: 1px solid #ddd;">{{leaving_date}}</td></tr>
          <tr><td style="padding: 15px; border: 1px solid #ddd;">Reason for Leaving</td><td style="padding: 15px; border: 1px solid #ddd;">{{reason}}</td></tr>
        </table>
        
        <div style="margin-top: 100px; display: flex; justify-content: space-around; text-align: center;">
          <div><p>___________________</p><p>Clerk</p></div>
          <div><p>___________________</p><p>Registrar</p></div>
          <div><p>___________________</p><p>Principal</p></div>
        </div>
      </div>
    `
  }
];

export async function GET() {
  try {
    await connectToDatabase();
    await LetterTemplate.deleteMany({});
    await LetterTemplate.insertMany(defaultTemplates);
    return NextResponse.json({ success: true, message: "Letter templates seeded successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
