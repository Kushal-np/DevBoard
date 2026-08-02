import mongoose, { Document, Types } from "mongoose";
export interface IPostDocument extends Document {
    userId: Types.ObjectId;
    text: string;
    imageUrl?: string;
    likes: Types.ObjectId[];
    likeCount: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IPostDocument, {}, {}, {}, mongoose.Document<unknown, {}, IPostDocument, {}, mongoose.DefaultSchemaOptions> & IPostDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IPostDocument>;
export default _default;
//# sourceMappingURL=post.model.d.ts.map