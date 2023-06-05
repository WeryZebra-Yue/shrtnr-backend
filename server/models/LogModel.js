import mongoose from "mongoose";

const Log = new mongoose.Schema({
  urlId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model("Log", Log);
