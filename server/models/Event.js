import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  imageURL: String,
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);
