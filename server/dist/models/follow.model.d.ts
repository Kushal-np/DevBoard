import mongoose, { Types } from "mongoose";
import { IFollow } from "../interfaces/dbModels/follow.interface.model";
declare const Follow: mongoose.Model<IFollow, {}, {}, {}, mongoose.Document<unknown, {}, IFollow, {}, mongoose.DefaultSchemaOptions> & IFollow & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IFollow>;
export default Follow;
//# sourceMappingURL=follow.model.d.ts.map