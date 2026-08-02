import { NotificationType } from "../models/notification.model";
interface CreateNotificationInput {
    recipientId: string;
    senderId: string;
    type: NotificationType;
    text: string;
    postId?: string;
    conversationId?: string;
}
export declare const createNotification: (input: CreateNotificationInput) => Promise<import("mongoose").PopulateDocumentResult<import("mongoose").Document<unknown, {}, import("../models/notification.model").INotification, {}, import("mongoose").DefaultSchemaOptions> & import("../models/notification.model").INotification & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, {}, import("../models/notification.model").INotification, import("../models/notification.model").INotification> | undefined>;
export {};
//# sourceMappingURL=notification.services.d.ts.map