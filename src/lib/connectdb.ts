import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI in .env.local");
}

// Define a type-safe cache
interface MongooseCache {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

// Use globalThis for better TypeScript compatibility
const globalWithMongoose = globalThis as unknown as { mongoose?: MongooseCache };

// Initialize cache
const cached: MongooseCache = globalWithMongoose.mongoose || { conn: null, promise: null };

async function connectDB(): Promise<Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "nextauth",
        bufferCommands: false,
      })
      .then((mongooseInstance) => mongooseInstance.connection); // Get the connection object
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
