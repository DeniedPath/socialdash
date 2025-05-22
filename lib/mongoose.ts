import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB connection string to .env.local');
}

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: unknown;
  promise: Promise<unknown> | null;
}
// eslint-disable-next-line
let cached = (global as any).mongoose as MongooseCache;

if (!cached) {
  // eslint-disable-next-line
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
// eslint-disable-next-line
const connectToDatabase = async (): Promise<typeof mongoose> => {
    try {
        return await mongoose.connect(process.env.MONGO_URI!);
    } catch (error: unknown) {
        console.error('Database connection error:', error);
        throw error;
    }
};

export default dbConnect;
