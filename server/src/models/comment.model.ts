import mongoose, { Schema } from "mongoose";
import { IComment } from "../interfaces/dbModels/comment.interface.model";

const commentSchema = new mongoose.Schema<IComment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    text: { type: String, required: true, maxlength: 500 },
  },
  { timestamps: true }
);

const Comment = mongoose.model<IComment>("Comment", commentSchema);
export default Comment;
