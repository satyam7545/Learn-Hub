const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Full error:', error);
    console.error('\nPlease check:');
    console.error('1. Your internet connection');
    console.error('2. MongoDB Atlas cluster is running');
    console.error('3. IP whitelist includes your current IP (or 0.0.0.0/0 for all IPs)');
    console.error('4. Database username and password are correct');
    process.exit(1);
  }
};

module.exports = connectDB;
