import mongoose, { Types } from "mongoose";
import { IStar } from "../interfaces/dbModels/star.interface.model";
declare const Star: mongoose.Model<IStar, {}, {}, {}, mongoose.Document<unknown, {}, IStar, {}, mongoose.DefaultSchemaOptions> & IStar & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IStar>;
export default Star;
//# sourceMappingURL=star.model.d.ts.map