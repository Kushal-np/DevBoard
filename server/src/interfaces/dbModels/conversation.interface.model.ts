import { Types } from "mongoose";

export interface IConversation {
  participants: Types.ObjectId[]; // always length 2 for DMs
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
