const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://user1:user1@cluster0.p7mxx.mongodb.net/GS-Moze';

async function checkDb() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');

  const Student = mongoose.connection.collection('students');
  const FeeStructure = mongoose.connection.collection('feestructures');

  const student = await Student.findOne(); // just find any
  console.log('Sample Student:', student);

  const feeStructures = await FeeStructure.find({}).toArray();
  console.log(`Found ${feeStructures.length} fee structures:`);
  console.log(feeStructures);

  mongoose.disconnect();
}

checkDb();
