import mongoose from "mongoose";

const searchLogSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  logs: [
    {
      searchQuery: { type: String, required: true },
      searchedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export const SearchLog = mongoose.model("SearchLog", searchLogSchema);
