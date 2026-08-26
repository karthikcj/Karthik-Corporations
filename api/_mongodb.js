// Shared MongoDB connection for Vercel serverless functions
const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://karthiksuperrockdon1_db_user:i5NvOMBH43F5yGTH@cluster1129.vhwleca.mongodb.net/brandDB?appName=Cluster1129';
    //mongodb+srv://<db_username>:i5NvOMBH43F5yGTH@cluster1129.vhwleca.mongodb.net/?appName=Cluster1129
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;

