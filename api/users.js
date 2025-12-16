// User management API serverless function
const connectDB = require('./_mongodb');
const { User, Admin } = require('./_models');
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

    const { method } = req;
    const { username, action } = req.query;

    switch (method) {
      case 'POST':
        // Handle registration or login based on action
        if (req.body.action === 'register') {
          // User registration
          try {
            const { username, password, fullName, phoneNumber, email, deliveryAddress, permanentAddress } = req.body;
            
            // Check if user already exists
            const existingUser = await User.findOne({ username });
            if (existingUser) {
              return res.status(400).json({ error: 'Username already exists' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Create new user
            const user = new User({
              username,
              password: hashedPassword,
              fullName: fullName || '',
              phoneNumber: phoneNumber || '',
              email: email || '',
              deliveryAddress: deliveryAddress || '',
              permanentAddress: permanentAddress || '',
              role: 'user'
            });
            
            await user.save();
            
            // Return user without password
            const userResponse = user.toObject();
            delete userResponse.password;
            
            res.status(201).json({ success: true, message: 'User registered successfully', user: userResponse });
          } catch (error) {
            if (error.code === 11000) {
              res.status(400).json({ error: 'Username already exists' });
            } else {
              res.status(500).json({ error: 'Server error', details: error.message });
            }
          }
        } else if (req.body.action === 'login') {
          // User login
          try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });

            if (!user) {
              return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Check password
            const isValidPassword = await bcrypt.compare(password, user.password);
            
            if (isValidPassword) {
              // Return user without password
              const userResponse = user.toObject();
              delete userResponse.password;
              
              res.json({ success: true, message: 'Login successful', user: userResponse });
            } else {
              res.status(401).json({ error: 'Invalid credentials' });
            }
          } catch (error) {
            res.status(500).json({ error: 'Server error', details: error.message });
          }
        } else {
          res.status(400).json({ error: 'Invalid action. Use "register" or "login"' });
        }
        break;

      case 'GET':
        // Get user profile(s)
        if (username) {
          // Get specific user profile
          try {
            const user = await User.findOne({ username }).select('-password');
            if (!user) {
              return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json(user);
          } catch (error) {
            res.status(500).json({ error: 'Server error', details: error.message });
          }
        } else if (req.query.all === 'true') {
          // Get all users (admin only - check if admin is authenticated via header)
          // For simplicity, we'll allow this endpoint but in production, add proper admin auth
          try {
            const users = await User.find().select('-password');
            res.status(200).json(users);
          } catch (error) {
            res.status(500).json({ error: 'Server error', details: error.message });
          }
        } else {
          res.status(400).json({ error: 'Username parameter or all=true is required' });
        }
        break;

      case 'PUT':
        // Update user profile
        try {
          const { username: updateUsername, ...updateData } = req.body;
          const targetUsername = updateUsername || username;
          
          if (!targetUsername) {
            return res.status(400).json({ error: 'Username is required' });
          }

          // If password is being updated, hash it
          if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
          }
          
          updateData.updatedAt = new Date();
          
          const user = await User.findOneAndUpdate(
            { username: targetUsername },
            { $set: updateData },
            { new: true, runValidators: true }
          ).select('-password');

          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }

          res.status(200).json({ success: true, message: 'User updated successfully', user });
        } catch (error) {
          res.status(500).json({ error: 'Server error', details: error.message });
        }
        break;

      case 'DELETE':
        // Delete user (admin only)
        try {
          if (!username) {
            return res.status(400).json({ error: 'Username is required' });
          }
          const user = await User.findOneAndDelete({ username });
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
          res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
          res.status(500).json({ error: 'Server error', details: error.message });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('User management error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

