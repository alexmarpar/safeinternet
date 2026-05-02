import mongoose from "mongoose";

export const configSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: String, // save here - "1.0.0"
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});