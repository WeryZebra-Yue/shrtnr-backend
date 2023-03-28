import mongoose from "mongoose";

const User = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email missing!"],
    unique: true,
  },
  credits: {
    type: Number,
    default: 100,
  },
  openings: {
    type: Array,
    default: [],
  },
  created_at: {
    type: Date,
    default: Date.now,
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
});

export default mongoose.model("User", User);
