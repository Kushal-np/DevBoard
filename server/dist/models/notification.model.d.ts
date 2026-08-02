import mongoose, { Document } from "mongoose";
export type NotificationType = "follow" | "like" | "comment" | "message";
export interface INotification extends Document {
    recipientId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    type: NotificationType;
    postId?: mongoose.Types.ObjectId;
    conversationId?: mongoose.Types.ObjectId;
    text: string;
    read: boolean;
    createdAt: Date;
}
declare const _default: mongoose.Model<INotification, {}, {}, {}, mongoose.Document<unknown, {}, INotification, {}, mongoose.DefaultSchemaOptions> & INotification & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, INotification>;
export default _default;
//# sourceMappingURL=notification.model.d.ts.map