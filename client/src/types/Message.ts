export interface IParticipant {
  _id: string;
  name: string;
  username: string;
  profile_url?: string;
}

export interface IConversation {
  _id: string;
  participants: IParticipant[];
  lastMessage?: string;
  lastMessageAt?: string;
}

export interface IMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  text: string;
  read: boolean;
  createdAt: string;
}
