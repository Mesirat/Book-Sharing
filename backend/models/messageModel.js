import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
    groupName: { type: String, required: true },
    sender: { type: String, required: true },
    text: { type: String, required: false },  // Make text optional
    status: { type: String, default: 'sending' },
    fileUrl: String,
    fileType: String,
    fileName: String,
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  });
export const Message = mongoose.model('message',messageSchema);