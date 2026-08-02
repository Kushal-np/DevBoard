import mongoose from "mongoose";
import { IBookmark } from "../interfaces/dbModels/bookmark.interface.model";
declare const Bookmark: mongoose.Model<IBookmark, {}, {}, {}, mongoose.Document<unknown, {}, IBookmark, {}, mongoose.DefaultSchemaOptions> & IBookmark & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IBookmark>;
export default Bookmark;
//# sourceMappingURL=bookmark.model.d.ts.map