import mongoose from "mongoose";

export const domainSchema = new mongoose.Schema({
  domain: {type: String, required: true},
}, {
  versionKey: false,
});
