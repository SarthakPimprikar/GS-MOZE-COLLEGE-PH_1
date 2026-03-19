import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import mongoose from 'mongoose';

// Models
import ProgramOutcome from '@/models/copo/ProgramOutcome';
import ProgramSpecificOutcome from '@/models/copo/ProgramSpecificOutcome';
import CourseOutcome from '@/models/copo/CourseOutcome';
import COPOMapping from '@/models/copo/COPOMapping';
import Assessment from '@/models/copo/Assessment';
import AssessmentMark from '@/models/copo/AssessmentMark';
import COAttainment from '@/models/copo/COAttainment';
import POAttainment from '@/models/copo/POAttainment';
import Student from '@/models/student';

// NBA POs
const nbaPOs = [
  { code: 'PO1', title: 'Engineering Knowledge', description: 'Apply knowledge of mathematics, science, engineering fundamentals.' },
  { code: 'PO2', title: 'Problem Analysis', description: 'Identify, formulate, review research literature, and analyze complex engineering problems.' },
  { code: 'PO3', title: 'Design/Development of Solutions', description: 'Design solutions for complex engineering problems and design system components.' },
  { code: 'PO4', title: 'Conduct Investigations of Complex Problems', description: 'Use research-based knowledge and research methods including design of experiments.' },
  { code: 'PO5', title: 'Modern Tool Usage', description: 'Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools.' },
  { code: 'PO6', title: 'The Engineer and Society', description: 'Apply reasoning informed by contextual knowledge to assess societal, health, safety, legal and cultural issues.' },
  { code: 'PO7', title: 'Environment and Sustainability', description: 'Understand the impact of professional engineering solutions in societal and environmental contexts.' },
  { code: 'PO8', title: 'Ethics', description: 'Apply ethical principles and commit to professional ethics and responsibilities.' },
  { code: 'PO9', title: 'Individual and Team Work', description: 'Function effectively as an individual, and as a member or leader in diverse teams.' },
  { code: 'PO10', title: 'Communication', description: 'Communicate effectively on complex engineering activities with the engineering community.' },
  { code: 'PO11', title: 'Project Management and Finance', description: 'Demonstrate knowledge and understanding of engineering and management principles.' },
  { code: 'PO12', title: 'Life-long Learning', description: 'Recognize the need for, and have the preparation and ability to engage in independent and life-long learning.' }
];

const departments = ['Computer Science', 'Civil Engineering', 'Mechanical Engineering', 'Electronics & TC'];
const mockUserId = new mongoose.Types.ObjectId();

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Wipe all CO-PO tables to ensure a clean slate
    await Promise.all([
      ProgramOutcome.deleteMany({}),
      ProgramSpecificOutcome.deleteMany({}),
      CourseOutcome.deleteMany({}),
      COPOMapping.deleteMany({}),
      Assessment.deleteMany({}),
      AssessmentMark.deleteMany({}),
      COAttainment.deleteMany({}),
      POAttainment.deleteMany({})
    ]);

    const academicYear = '2024-25';

    // 2. Insert NBA POs
    const poDocs = await ProgramOutcome.insertMany(
      nbaPOs.map(po => ({ ...po, isNBAStandard: true, programType: 'UG' }))
    );

    // 3. Insert PSOs per department
    const psoDocs = [];
    for (const dept of departments) {
      psoDocs.push(
        ...await ProgramSpecificOutcome.insertMany([
          { code: 'PSO1', title: 'Domain Knowledge Application', description: `Apply ${dept} core concepts to solve industrial problems`, department: dept, programType: 'UG', createdBy: mockUserId },
          { code: 'PSO2', title: 'System Development', description: `Develop modern systems using advanced ${dept} tools`, department: dept, programType: 'UG', createdBy: mockUserId }
        ])
      );
    }

    // Generate mock students if none exist
    let students = await Student.find({}).limit(5);
    if (students.length === 0) {
      students = await Student.insertMany([
        { studentId: 'STD1001', name: 'Rahul Sharma', rollNumber: 'R1001', gender: 'Male', dob: new Date('2000-01-01'), email: 'rahul@test.com', department: 'Comp', course: 'B.E.', class: 'SE' },
        { studentId: 'STD1002', name: 'Sneha Patil', rollNumber: 'R1002', gender: 'Female', dob: new Date('2000-02-01'), email: 'sneha@test.com', department: 'Comp', course: 'B.E.', class: 'SE' },
        { studentId: 'STD1003', name: 'Amit Kumar', rollNumber: 'R1003', gender: 'Male', dob: new Date('2000-03-01'), email: 'amit@test.com', department: 'Comp', course: 'B.E.', class: 'SE' }
      ]);
    }

    // Make mock data across all 4 departments to populate the overview rings
    for (const dept of departments) {
      const subjectCode = dept === 'Computer Science' ? 'CS301' : 
                          dept === 'Civil Engineering' ? 'CE301' :
                          dept === 'Mechanical Engineering' ? 'ME301' : 'ET301';
                          
      const subjectName = dept === 'Computer Science' ? 'Database Management Systems' : 
                          dept === 'Civil Engineering' ? 'Structural Analysis' :
                          dept === 'Mechanical Engineering' ? 'Thermodynamics' : 'Digital Electronics';

      // 4. Create COs
      const coDocs = await CourseOutcome.insertMany([
        { subjectCode, subjectName, department: dept, academicYear, semester: 3, code: 'CO1', statement: 'Understand the basic concepts', bloomsLevel: 'Understand', status: 'approved', createdBy: mockUserId },
        { subjectCode, subjectName, department: dept, academicYear, semester: 3, code: 'CO2', statement: 'Apply algorithms to solve problems', bloomsLevel: 'Apply', status: 'approved', createdBy: mockUserId },
        { subjectCode, subjectName, department: dept, academicYear, semester: 3, code: 'CO3', statement: 'Design system architectures', bloomsLevel: 'Create', status: 'approved', createdBy: mockUserId },
        { subjectCode, subjectName, department: dept, academicYear, semester: 3, code: 'CO4', statement: 'Evaluate system performance', bloomsLevel: 'Evaluate', status: 'approved', createdBy: mockUserId }
      ]);

      // 5. Create Mappings (Matrix)
      const deptPsoDocs = psoDocs.filter(p => p.department === dept);
      const mappings = [];
      coDocs.forEach((co, idx) => {
        poDocs.forEach((po, pIdx) => {
          // Random 1, 2, 3 logic for visual variety
          const level = ((idx + pIdx) % 3) + 1; 
          mappings.push({ coId: co._id, coCode: co.code, targetId: po._id, targetCode: po.code, targetType: 'PO', level });
        });
        deptPsoDocs.forEach((pso, pIdx) => {
          const level = ((idx + pIdx + 1) % 3) + 1;
          mappings.push({ coId: co._id, coCode: co.code, targetId: pso._id, targetCode: pso.code, targetType: 'PSO', level });
        });
      });

      await COPOMapping.create({
        subjectCode, subjectName, department: dept, academicYear, semester: 3, createdBy: mockUserId,
        mappings, status: 'approved'
      });

      // 6. Assessments
      const midTerm = await Assessment.create({
        name: 'Mid-Term Exam', type: 'Internal', subjectCode, subjectName, department: dept, academicYear, semester: 3, maxMarks: 30, createdBy: mockUserId, totalMarks: 30,
        questionCOMap: [
          { questionNo: 'Q1', coCodes: ['CO1'], maxMarks: 15, targetThreshold: 60 },
          { questionNo: 'Q2', coCodes: ['CO2'], maxMarks: 15, targetThreshold: 60 }
        ]
      });

      // 7. Marks for Students
      const marks = [];
      students.forEach(s => {
        marks.push({
          assessmentId: midTerm._id, studentId: s._id, uploadedBy: mockUserId, studentRollNo: s.rollNumber,
          questionMarks: [
            { questionNo: 'Q1', marksObtained: Math.floor(Math.random() * (15 - 8) + 8) }, // Random marks 8-15
            { questionNo: 'Q2', marksObtained: Math.floor(Math.random() * (15 - 8) + 8) }
          ]
        });
      });
      await AssessmentMark.insertMany(marks);

      // 8. Mock COAttainment Documents (For Instant Analytics)
      const coAttainments = [];
      coDocs.forEach(co => {
        // Random overall attainment between 50% and 95%
        const attainmentPercentage = Math.floor(Math.random() * (95 - 50) + 50);
        coAttainments.push({
          coId: co._id, coCode: co.code, subjectCode, subjectName, department: dept, academicYear, semester: 3,
          totalStudents: students.length, studentsAboveThreshold: Math.floor((attainmentPercentage/100) * students.length), 
          threshold: 60, attainmentPercentage
        });
      });
      const storedCoAttains = await COAttainment.insertMany(coAttainments);

      // 9. Mock POAttainment Documents
      // Group mappings by targetId
      const targetMap = {};
      mappings.forEach(m => {
        if (!targetMap[m.targetCode]) {
          targetMap[m.targetCode] = { code: m.targetCode, type: m.targetType, id: m.targetId, contributions: [] };
        }
        const coAttain = storedCoAttains.find(ca => ca.coId.toString() === m.coId.toString());
        if (coAttain) {
          targetMap[m.targetCode].contributions.push({
            coId: m.coId, coCode: m.coCode, mappingLevel: m.level, coAttainment: coAttain.attainmentPercentage
          });
        }
      });

      const poAttainments = [];
      Object.keys(targetMap).forEach(key => {
        const target = targetMap[key];
        let totalLevel = 0;
        let weightedSum = 0;
        target.contributions.forEach(c => {
          totalLevel += c.mappingLevel;
          weightedSum += c.mappingLevel * c.coAttainment;
        });

        const finalAttainment = totalLevel > 0 ? (weightedSum / (totalLevel * 100)) * 100 : 0; // Simplified
        // Actually the standard NBA formula is weighted attainment = sum / sum(mappinglevels)
        // Wait, weightedSum is already mappingLevel * attainmentPercentage. So (weightedSum / totalLevel) is the % 
        const attainmentPercentage = totalLevel > 0 ? (weightedSum / totalLevel) : 0;

        poAttainments.push({
          poId: target.id, poCode: target.code, targetType: target.type, department: dept, academicYear,
          attainmentPercentage, coContributions: target.contributions
        });
      });

      await POAttainment.insertMany(poAttainments);
    }

    return NextResponse.json({ success: true, message: 'All CO-PO models seeded successfully with full mock data.' });
  } catch (error) {
    console.error('Seed Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
