import { Types } from "mongoose";

export interface IBookmark {
  userId: Types.ObjectId;
  projectId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
