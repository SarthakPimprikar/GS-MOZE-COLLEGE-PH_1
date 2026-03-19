const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://delxn:delxn@cluster0.9huz0ct.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function checkDb() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');

  const Student = mongoose.connection.collection('students');
  const FeeStructure = mongoose.connection.collection('feestructures');

  const student = await Student.findOne(); 
  console.log('Sample Student ID:', student?._id);
  console.log('Course:', student?.course);
  console.log('Category:', student?.category);
  console.log('Class:', student?.class);
  console.log('Department:', student?.department);

  const testStudentId = '69b3abe83bd5ea523b69094c'; // The ID from the user's error prompt
  if (mongoose.Types.ObjectId.isValid(testStudentId)) {
    const specificStudent = await Student.findOne({ _id: new mongoose.Types.ObjectId(testStudentId) });
    console.log('\nSpecific Student data:', specificStudent);
  } else {
    console.log(`\nID ${testStudentId} is not a valid ObjectId format.`);
    const specificStudent = await Student.findOne({ _id: testStudentId }); // Sometimes IDs are strings
    console.log('Specific Student data (String ID):', specificStudent);
  }

  const feeStructures = await FeeStructure.find({}).toArray();
  console.log(`\nFound ${feeStructures.length} fee structures:`);
  console.log(feeStructures);

  mongoose.disconnect();
}

checkDb().catch(console.error);
