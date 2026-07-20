import mongoose, { Schema } from "mongoose";
import { IConversation } from "../interfaces/dbModels/conversation.interface.model";

const conversationSchema = new mongoose.Schema<IConversation>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: { type: String },
    lastMessageAt: { type: Date },
  },
  { timestamps: true }
);

const Conversation = mongoose.model<IConversation>("Conversation", conversationSchema);
export default Conversation;
