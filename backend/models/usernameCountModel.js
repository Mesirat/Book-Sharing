import mongoose from "mongoose";

const usernameCounterSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    unique: true,
  },
  counter: {
    type: Number,
    default: 0,
  },
});

export const UsernameCounter = mongoose.model("UsernameCounter", usernameCounterSchema);