import mongoose from "mongoose";

const Opening = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    skills: {
      type: Array,
      required: true,
    },
    status: {
      type: String,
      default: "active",
    },
    predictions: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Opening", Opening);
