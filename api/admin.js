// Admin authentication API serverless function (login only, no registration)
const connectDB = require('./_mongodb');
const { Admin } = require('./_models');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectDB();

    if (req.method === 'POST') {
      // Initialize default admin if it doesn't exist
      const defaultAdmin = await Admin.findOne({ userid: 'admin' });
      if (!defaultAdmin) {
        const hashedPassword = await bcrypt.hash('adminsData', 10);
        const admin = new Admin({ userid: 'admin', password: hashedPassword });
        await admin.save();
      }

      // Handle login
      const { userid, password } = req.body;
      const admin = await Admin.findOne({ userid });

      if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password (support both plain text for backward compatibility and hashed)
      let isValidPassword = false;
      if (admin.password.startsWith('$2')) {
        // Bcrypt hashed password
        isValidPassword = await bcrypt.compare(password, admin.password);
      } else if (admin.password === password) {
        // Plain text password (for backward compatibility)
        isValidPassword = true;
        // Upgrade to hashed password
        const hashedPassword = await bcrypt.hash(password, 10);
        admin.password = hashedPassword;
        await admin.save();
      }

      if (isValidPassword) {
        res.json({ success: true, message: 'Login successful' });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Admin authentication error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

