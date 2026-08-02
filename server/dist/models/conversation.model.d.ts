import mongoose from "mongoose";
import { IConversation } from "../interfaces/dbModels/conversation.interface.model";
declare const Conversation: mongoose.Model<IConversation, {}, {}, {}, mongoose.Document<unknown, {}, IConversation, {}, mongoose.DefaultSchemaOptions> & IConversation & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IConversation>;
export default Conversation;
//# sourceMappingURL=conversation.model.d.ts.map