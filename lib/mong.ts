import mongoose from 'mongoose';

const MONGODB_URI = process.env.Mongo_API;


let cached = (global as any).mongoose || { conn: null, promise: null };
    cached.promise = mongoose.connect(MONGODB_URI || '');
export async function connectMongo() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI || '');
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
