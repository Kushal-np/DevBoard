import mongoose, { Schema, Document } from "mongoose";

export type NotificationType = "follow" | "like" | "comment" | "message";

export interface INotification extends Document {
  recipientId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  type: NotificationType;
  postId?: mongoose.Types.ObjectId;
  conversationId?: mongoose.Types.ObjectId;
  text: string;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["follow", "like", "comment", "message"], required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Project" },
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation" },
    text: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>("Notification", notificationSchema);