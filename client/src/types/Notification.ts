export interface INotificationUser {
  _id: string;
  name: string;
  username: string;
  profile_url?: string;
}

export type NotificationType = "follow" | "like" | "comment" | "message";

export interface INotification {
  _id: string;
  recipientId: string;
  senderId: INotificationUser;
  type: NotificationType;
  postId?: string;
  conversationId?: string;
  text: string;
  read: boolean;
  createdAt: string;
}