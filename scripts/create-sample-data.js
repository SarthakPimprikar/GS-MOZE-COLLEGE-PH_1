// Script to create sample admission and student data with proper division assignments
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/erp-system');

mongoose.connection.on('connected', async () => {
  try {
    const db = mongoose.connection.db;
    
    // Import models
    const admission = require('../src/app/models/admissionSchema').default;
    const Student = require('../src/app/models/studentSchema').default;
    
    console.log('🔧 Creating sample admission and student data with divisions...');
    
    // Sample admission data with divisions
    const sampleAdmissions = [
      {
        fullName: "Prajal PP Shete",
        email: "prajal@gmail.com",
        studentWhatsappNumber: 1111111111,
        dateOfBirth: "2005-06-15",
        gender: "Male",
        programType: "Diploma",
        branch: "Mechanical Engineering",
        year: "1st Year",
        division: "A", // ← Division assigned here
        admissionYear: "2026",
        round: "CAP1",
        seatType: "GOV",
        admissionCategoryDTE: "CAP",
        feesCategory: "none",
        totalFees: 92000,
        status: "approved",
        address: [{
          addressLine: "Test Address",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: 400001,
          country: "India"
        }]
      },
      {
        fullName: "Rahul Kumar Singh",
        email: "rahul@gmail.com",
        studentWhatsappNumber: 2222222222,
        dateOfBirth: "2004-08-20",
        gender: "Male",
        programType: "Diploma",
        branch: "Mechanical Engineering",
        year: "1st Year",
        division: "B", // ← Different division
        admissionYear: "2026",
        round: "CAP1",
        seatType: "GOV",
        admissionCategoryDTE: "CAP",
        feesCategory: "none",
        totalFees: 92000,
        status: "approved",
        address: [{
          addressLine: "Test Address 2",
          city: "Pune",
          state: "Maharashtra",
          pincode: 411001,
          country: "India"
        }]
      },
      {
        fullName: "Priya Sharma",
        email: "priya@gmail.com",
        studentWhatsappNumber: 3333333333,
        dateOfBirth: "2005-02-10",
        gender: "Female",
        programType: "UG",
        branch: "Computer Science",
        year: "1st Year",
        division: "A", // ← Division A for CS
        admissionYear: "2026",
        round: "CAP2",
        seatType: "Management",
        admissionCategoryDTE: "CAP",
        feesCategory: "General",
        totalFees: 150000,
        status: "approved",
        address: [{
          addressLine: "Test Address 3",
          city: "Delhi",
          state: "Delhi",
          pincode: 110001,
          country: "India"
        }]
      }
    ];
    
    // Create admission records
    console.log('📝 Creating admission records...');
    const createdAdmissions = [];
    
    for (const admissionData of sampleAdmissions) {
      const newAdmission = new admission(admissionData);
      const savedAdmission = await newAdmission.save();
      createdAdmissions.push(savedAdmission);
      console.log(`✅ Created admission for ${admissionData.fullName} - Division: ${admissionData.division}`);
    }
    
    // Create student records from admissions
    console.log('👨‍🎓 Creating student records...');
    
    for (const admissionRecord of createdAdmissions) {
      const studentId = `STU${Date.now()}${Math.floor(Math.random() * 1000)}`;
      const prn = `PRN${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      const studentData = {
        studentId: studentId,
        admissionId: admissionRecord._id,
        fullName: admissionRecord.fullName,
        email: admissionRecord.email,
        mobileNumber: admissionRecord.studentWhatsappNumber.toString(),
        dateOfBirth: new Date(admissionRecord.dateOfBirth),
        gender: admissionRecord.gender,
        address: admissionRecord.address,
        programType: admissionRecord.programType,
        branch: admissionRecord.branch,
        currentYear: admissionRecord.year,
        division: admissionRecord.division, // ← Division transferred from admission
        status: 'active',
        totalFees: admissionRecord.totalFees,
        feesCategory: admissionRecord.feesCategory,
        admissionYear: admissionRecord.admissionYear,
        prn: prn
      };
      
      const student = new Student(studentData);
      await student.save();
      
      console.log(`✅ Created student: ${student.fullName} - Division: ${student.division} - Student ID: ${student.studentId}`);
    }
    
    console.log('\n🎉 Sample data creation completed!');
    console.log('📊 Summary:');
    console.log(`   - Admissions created: ${createdAdmissions.length}`);
    console.log(`   - Students created: ${createdAdmissions.length}`);
    console.log('   - Divisions assigned: A, B');
    console.log('\n🔍 Test the division assignment:');
    console.log('   1. Go to admin student profiles');
    console.log('   2. Filter by Division A or B');
    console.log('   3. Go to teacher attendance');
    console.log('   4. Select Division A or B');
    console.log('   5. See students from selected division only');
    
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  } finally {
    mongoose.disconnect();
  }
});
