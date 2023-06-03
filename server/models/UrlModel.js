import mongoose from "mongoose";

const Url = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name missing!"],
  },
  description: {
    type: String,
  },
  url: {
    type: String,
    required: [true, "URL missing!"],
  },
  shorturl: {
    type: String,
    required: [true, "Short URL missing!"],
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Url", Url);
