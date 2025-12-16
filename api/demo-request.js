// Demo request API serverless function
const connectDB = require('./_mongodb');
const { DemoRequest } = require('./_models');

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

    switch (method) {
      case 'POST':
        try {
          const demoRequest = new DemoRequest(req.body);
          await demoRequest.save();
          res.status(201).json({ success: true, message: 'Demo request submitted successfully', data: demoRequest });
        } catch (error) {
          res.status(500).json({ error: 'Server error', details: error.message });
        }
        break;

      case 'GET':
        try {
          const requests = await DemoRequest.find().sort({ createdAt: -1 });
          res.status(200).json(requests);
        } catch (error) {
          res.status(500).json({ error: 'Server error', details: error.message });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Demo request error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

