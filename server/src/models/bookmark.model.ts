import mongoose, { Schema } from "mongoose";
import { IBookmark } from "../interfaces/dbModels/bookmark.interface.model";

const bookmarkSchema = new mongoose.Schema<IBookmark>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  },
  { timestamps: true }
);

// one bookmark per user per project
bookmarkSchema.index({ userId: 1, projectId: 1 }, { unique: true });

const Bookmark = mongoose.model<IBookmark>("Bookmark", bookmarkSchema);
export default Bookmark;
