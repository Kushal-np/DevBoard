import mongoose from "mongoose";
import { IMessage } from "../interfaces/dbModels/message.interface.model";
declare const Message: mongoose.Model<IMessage, {}, {}, {}, mongoose.Document<unknown, {}, IMessage, {}, mongoose.DefaultSchemaOptions> & IMessage & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IMessage>;
export default Message;
//# sourceMappingURL=message.model.d.ts.map