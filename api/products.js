// Products API serverless function
const connectDB = require('./_mongodb');
const { Product } = require('./_models');

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
    const { id } = req.query;

    switch (method) {
      case 'GET':
        try {
          const products = await Product.find();
          res.status(200).json(products);
        } catch (error) {
          res.status(500).json({ error: 'Server error', details: error.message });
        }
        break;

      case 'POST':
        try {
          const productData = req.body;
          if (!productData.id) {
            productData.id = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          }
          const product = new Product(productData);
          await product.save();
          res.status(201).json(product);
        } catch (error) {
          res.status(500).json({ error: 'Server error', details: error.message });
        }
        break;

      case 'PUT':
        try {
          if (!id) {
            return res.status(400).json({ error: 'Product ID is required' });
          }
          const product = await Product.findOneAndUpdate(
            { id: id },
            req.body,
            { new: true, runValidators: true }
          );
          if (!product) {
            return res.status(404).json({ error: 'Product not found' });
          }
          res.status(200).json(product);
        } catch (error) {
          res.status(500).json({ error: 'Server error', details: error.message });
        }
        break;

      case 'DELETE':
        try {
          if (!id) {
            return res.status(400).json({ error: 'Product ID is required' });
          }
          const product = await Product.findOneAndDelete({ id: id });
          if (!product) {
            return res.status(404).json({ error: 'Product not found' });
          }
          res.status(200).json({ message: 'Product deleted' });
        } catch (error) {
          res.status(500).json({ error: 'Server error', details: error.message });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
};

