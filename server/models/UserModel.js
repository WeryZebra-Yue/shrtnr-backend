import mongoose from "mongoose";

const User = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email missing!"],
      unique: true,
    },
    password: {
      type: String,
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
    signedUpWith: {
      type: String,
      enum: ["google", "email"],
    },
    tags: {
      type: [
        {
          type: String,
          enum: ["waitlist_user", "admin", "user"],
        },
      ],
      default: ["user"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", User);
