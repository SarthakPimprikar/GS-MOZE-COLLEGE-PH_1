import mongoose from 'mongoose';

const InventorySchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'Please provide item name'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please provide category'],
    enum: ['Electronics', 'Furniture', 'Stationery', 'Lab Equipment', 'Cleaning', 'Others'],
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide quantity'],
    default: 0,
  },
  unit: {
    type: String,
    required: [true, 'Please provide unit (e.g., Pcs, Boxes, Liters)'],
  },
  minStockLevel: {
    type: Number,
    default: 5,
  },
  pricePerUnit: {
    type: Number,
    required: [true, 'Please provide price per unit'],
  },
  supplier: {
    name: String,
    contact: String,
    email: String,
  },
  location: {
    type: String,
    default: 'Main Store',
  },
  status: {
    type: String,
    enum: ['In Stock', 'Out of Stock', 'Low Stock'],
    default: 'In Stock',
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, { timestamps: true });

// Middleware to update status based on quantity
InventorySchema.pre('save', function(next) {
  if (this.quantity <= 0) {
    this.status = 'Out of Stock';
  } else if (this.quantity <= this.minStockLevel) {
    this.status = 'Low Stock';
  } else {
    this.status = 'In Stock';
  }
  next();
});

export default mongoose.models.Inventory || mongoose.model('Inventory', InventorySchema);
