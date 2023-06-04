import mongoose from "mongoose";

const Url = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Url", Url);
