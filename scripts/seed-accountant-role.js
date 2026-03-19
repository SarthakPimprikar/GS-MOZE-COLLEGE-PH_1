const mongoose = require('mongoose');
const Role = require('../src/models/Role');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/erp-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedAccountantRole = async () => {
  try {
    // Check if accountant role already exists
    const existingRole = await Role.findOne({ name: 'Accountant' });
    
    if (existingRole) {
      console.log('Accountant role already exists');
      return;
    }

    // Create accountant role with appropriate permissions
    const accountantRole = new Role({
      name: 'Accountant',
      description: 'Financial management and accounting access with fee structure and payment management capabilities',
      permissions: [
        'sidebar.overview',
        'sidebar.feeStructure&payments',
        'sidebar.student-profiles',
        'sidebar.attendance-overview',
        'finance.view_invoices',
        'finance.create_invoices',
        'finance.approve_invoices',
        'report.view',
        'report.export'
      ],
      isSystem: false
    });

    await accountantRole.save();
    console.log('Accountant role created successfully');
    
    // Create a sample accountant user
    const User = require('../src/models/userSchema');
    const bcrypt = require('bcryptjs');
    
    const existingAccountant = await User.findOne({ email: 'accountant@techedu.com' });
    
    if (!existingAccountant) {
      const hashedPassword = await bcrypt.hash('accountant123', 10);
      
      const accountantUser = new User({
        fullName: 'System Accountant',
        email: 'accountant@techedu.com',
        password: hashedPassword,
        role: 'accountant',
        department: 'Finance',
        isActive: true
      });

      await accountantUser.save();
      console.log('Sample accountant user created successfully');
      console.log('Email: accountant@techedu.com');
      console.log('Password: accountant123');
    } else {
      console.log('Accountant user already exists');
    }
    
  } catch (error) {
    console.error('Error seeding accountant role:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedAccountantRole();
