import type { IPost } from "./Post";

export interface IBookmark {
  _id: string;
  userId: string;
  projectId: IPost;
  createdAt: string;
  updatedAt: string;
}
