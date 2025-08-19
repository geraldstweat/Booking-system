import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/myapp";

if (!MONGODB_URI) {
  throw new Error("❌ Please add your Mongo URI to .env.local");
}

let isConnected = false; // to prevent multiple connections in dev

export const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error", error);
  }
};