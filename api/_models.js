// Database models for serverless functions
const mongoose = require('mongoose');

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  id: String
}, { collection: 'products' });

// Admin User Schema
const adminSchema = new mongoose.Schema({
  userid: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'admins' });

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: String,
  phoneNumber: String,
  email: String,
  deliveryAddress: String,
  permanentAddress: String,
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { collection: 'users' });

// Demo Request Schema
const demoRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' }
}, { collection: 'demoRequests' });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);
const DemoRequest = mongoose.models.DemoRequest || mongoose.model('DemoRequest', demoRequestSchema);

module.exports = { Product, Admin, User, DemoRequest };

