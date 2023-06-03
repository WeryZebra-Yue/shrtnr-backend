import mongoose from "mongoose";

const User = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email missing!"],
      unique: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password missing!"],
    },
    urls: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", User);
