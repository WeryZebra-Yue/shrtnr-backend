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
      required: [true, "First name missing!"],
    },
    lastName: {
      type: String,
      required: [true, "Last name missing!"],
    },
    avatar: {
      type: String,
      default: "",
    },
    credits: {
      type: Number,
      default: 100,
    },
    openings: {
      type: Array,
      default: [],
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
