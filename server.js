const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/brandDB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  id: String
});

const Product = mongoose.model('Product', productSchema);

// Admin User Schema
const adminSchema = new mongoose.Schema({
  userid: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);

// Demo Request Schema
const demoRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' }
});

const DemoRequest = mongoose.model('DemoRequest', demoRequestSchema);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Karthik Corp API. Use /api/products to fetch products.');
});

// API endpoint to fetch products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// API endpoint to create product
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// API endpoint to update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// API endpoint to delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Admin Authentication - Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { userid, password } = req.body;
    const admin = await Admin.findOne({ userid });
    
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // For plain text passwords (initial setup), compare directly
    // In production, use bcrypt.compare(password, admin.password)
    if (admin.password === password || (admin.password.startsWith('$2') && await bcrypt.compare(password, admin.password))) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Admin Authentication - Register (for initial setup)
app.post('/api/admin/register', async (req, res) => {
  try {
    const { userid, password } = req.body;
    const existingAdmin = await Admin.findOne({ userid });
    
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin user already exists' });
    }

    // Hash password (or store plain text for simplicity)
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ userid, password: hashedPassword });
    await admin.save();
    
    res.json({ success: true, message: 'Admin created successfully' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Demo Request - Create
app.post('/api/demo-request', async (req, res) => {
  try {
    const demoRequest = new DemoRequest(req.body);
    await demoRequest.save();
    res.json({ success: true, message: 'Demo request submitted successfully', data: demoRequest });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Demo Request - Get all (for admin)
app.get('/api/demo-requests', async (req, res) => {
  try {
    const requests = await DemoRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));