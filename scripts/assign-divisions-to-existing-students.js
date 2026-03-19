// Script to assign divisions to existing students
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/erp-system');

mongoose.connection.on('connected', async () => {
  try {
    const db = mongoose.connection.db;
    
    // Import Student model
    const Student = require('../src/app/models/studentSchema').default;
    
    console.log('🔧 Assigning divisions to existing students...');
    
    // Get all students without division
    const studentsWithoutDivision = await Student.find({
      $or: [
        { division: null },
        { division: "" },
        { division: "Not Assigned" },
        { division: { $exists: false } }
      ]
    });
    
    console.log(`📊 Found ${studentsWithoutDivision.length} students without division`);
    
    if (studentsWithoutDivision.length === 0) {
      console.log('✅ All students already have divisions assigned!');
      mongoose.disconnect();
      return;
    }
    
    // Assign divisions based on branch and program type
    const divisionRules = {
      "Computer Science": {
        "UG": ["A", "B", "C"],
        "PG": ["A", "B"],
        "Diploma": ["A"]
      },
      "Mechanical Engineering": {
        "UG": ["A", "B"],
        "PG": ["A"],
        "Diploma": ["A", "B"]
      },
      "Information Technology": {
        "UG": ["A", "B"],
        "Diploma": ["A"]
      },
      "Electronics Engineering": {
        "UG": ["A", "B"],
        "Diploma": ["A"]
      }
    };
    
    let updatedCount = 0;
    
    for (const student of studentsWithoutDivision) {
      const branch = student.branch || "Computer Science";
      const programType = student.programType || "UG";
      
      // Get available divisions for this branch and program
      const availableDivisions = divisionRules[branch]?.[programType] || ["A", "B"];
      
      // Assign division based on student ID hash (consistent assignment)
      const studentHash = student._id.toString().charCodeAt(0);
      const divisionIndex = studentHash % availableDivisions.length;
      const assignedDivision = availableDivisions[divisionIndex];
      
      // Update student
      await Student.findByIdAndUpdate(student._id, {
        division: assignedDivision
      });
      
      console.log(`✅ Updated ${student.fullName}: ${branch} ${programType} → Division ${assignedDivision}`);
      updatedCount++;
    }
    
    console.log('\n🎉 Division assignment completed!');
    console.log(`📊 Updated ${updatedCount} students with divisions`);
    
    // Show division distribution
    const divisionStats = await Student.aggregate([
      { $group: { _id: "$division", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\n📈 Division Distribution:');
    divisionStats.forEach(stat => {
      console.log(`   Division ${stat._id}: ${stat.count} students`);
    });
    
  } catch (error) {
    console.error('❌ Error assigning divisions:', error);
  } finally {
    mongoose.disconnect();
  }
});
