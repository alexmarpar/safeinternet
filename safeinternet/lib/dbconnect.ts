import mongoose from "mongoose";

let isConnected = false;

export async function dbConnect() {
  if (isConnected) return;

  const MONGO_URI = process.env.MONGODB_URL;

  if (!MONGO_URI) {
    throw new Error("MONGODB_URL is not defined");
  }

  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Mongo error:", error);
    throw error;
  }
}