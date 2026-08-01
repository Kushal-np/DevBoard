import Notification, { NotificationType } from "../models/notification.model";
import { emitToUser } from "../sockets/socketRegistry";

interface CreateNotificationInput {
  recipientId: string;
  senderId: string;
  type: NotificationType;
  text: string;
  postId?: string;
  conversationId?: string;
}

export const createNotification = async (input: CreateNotificationInput) => {
  if (input.recipientId === input.senderId) return; // don't notify yourself

  const notification = await Notification.create(input);
  const populated = await notification.populate("senderId", "name username profile_url");

  emitToUser(input.recipientId, "new-notification", populated);

  return populated;
};