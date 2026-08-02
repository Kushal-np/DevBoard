import { HydratedDocument, Types } from "mongoose";
export interface IBookmark {
    userId: Types.ObjectId;
    projectId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export type BookmarkDocument = HydratedDocument<IBookmark>;
//# sourceMappingURL=bookmark.interface.model.d.ts.map