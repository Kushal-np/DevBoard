export interface IChatUser {
  _id: string;
  name: string;
  username: string;
  profile_url?: string;
}

export interface IConversation {
  _id: string;
  participants: IChatUser[];
  lastMessage?: string;
  lastMessageAt?: string;
}

export interface IMessage {
  _id: string;
  conversationId: string;
  senderId: IChatUser | string;
  text: string;
  createdAt: string;
}