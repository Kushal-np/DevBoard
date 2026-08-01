import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPostDocument extends Document {
  userId: Types.ObjectId;
  text: string;
  imageUrl?: string;
  likes: Types.ObjectId[];
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPostDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
    imageUrl: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    likeCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IPostDocument>("Post", postSchema);