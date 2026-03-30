const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function seedInventory() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', new mongoose.Schema({
      itemName: String,
      category: String,
      quantity: Number,
      unit: String,
      minStockLevel: Number,
      pricePerUnit: Number,
      location: String,
      status: String
    }, { timestamps: true }));

    const AMC = mongoose.models.AMC || mongoose.model('AMC', new mongoose.Schema({
      itemId: mongoose.Schema.Types.ObjectId,
      itemName: String,
      vendorName: String,
      vendorContact: String,
      startDate: Date,
      endDate: Date,
      renewalDate: Date,
      amcCost: Number,
      status: String
    }, { timestamps: true }));

    // Clear existing
    await Inventory.deleteMany({});
    await AMC.deleteMany({});

    const items = [
      { itemName: "Dell Latitude 5420", category: "Electronics", quantity: 25, unit: "Pcs", minStockLevel: 5, pricePerUnit: 55000, location: "Computer Lab 1", status: "In Stock" },
      { itemName: "HP Laserjet Pro", category: "Electronics", quantity: 8, unit: "Pcs", minStockLevel: 3, pricePerUnit: 15000, location: "Admin Office", status: "In Stock" },
      { itemName: "Chemistry Beakers 500ml", category: "Lab Equipment", quantity: 2, unit: "Boxes", minStockLevel: 5, pricePerUnit: 1200, location: "Chemistry Lab", status: "Low Stock" },
      { itemName: "Office Chairs", category: "Furniture", quantity: 50, unit: "Pcs", minStockLevel: 10, pricePerUnit: 3500, location: "Staff Room", status: "In Stock" }
    ];

    const seededItems = await Inventory.insertMany(items);
    console.log("Inventory seeded");

    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 15);

    const amcs = [
      { 
        itemId: seededItems[0]._id, 
        itemName: seededItems[0].itemName, 
        vendorName: "Dell Services India", 
        vendorContact: "support@dell.com", 
        startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
        endDate: nextMonth,
        renewalDate: nextMonth,
        amcCost: 15000,
        status: "Pending Renewal"
      },
      { 
        itemId: seededItems[1]._id, 
        itemName: seededItems[1].itemName, 
        vendorName: "HP Care", 
        vendorContact: "800-474-6836", 
        startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
        endDate: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()),
        renewalDate: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()),
        amcCost: 5000,
        status: "Active"
      }
    ];

    await AMC.insertMany(amcs);
    console.log("AMC seeded");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedInventory();
