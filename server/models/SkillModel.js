import mongoose from "mongoose";

const Skill = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Skill", Skill);
