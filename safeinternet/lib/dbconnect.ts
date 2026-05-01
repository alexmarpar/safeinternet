import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/";

let isConnected = false;

export async function dbConnect() {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log("Mongodb database connected");
  } catch (error) {
    console.error(error);
  }
}