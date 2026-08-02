import { Types } from "mongoose";
export interface IMessage {
    conversationId: Types.ObjectId;
    senderId: Types.ObjectId;
    text: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=message.interface.model.d.ts.map