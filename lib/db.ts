import mongoose from 'mongoose';

// Connection string - this should be in an environment variable in production
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/echopulse';

// Track connection status
let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      // Options if needed
    });

    isConnected = !!db.connections[0].readyState;

    console.log('MongoDB connected successfully');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to database');
  }
}