import type { IConversation, IMessage } from "../../types/Message";
import apiClient from "../axiosConfig";
import { MESSAGE_ENDPOINTS } from "../endpoints";

export const getConversations = async (): Promise<{
  success: boolean;
  conversations: IConversation[];
}> => {
  const { data } = await apiClient.get(MESSAGE_ENDPOINTS.CONVERSATIONS);
  return data;
};

export const startConversation = async (
  recipientId: string
): Promise<{ success: boolean; conversation: IConversation }> => {
  const { data } = await apiClient.post(MESSAGE_ENDPOINTS.START, { recipientId });
  return data;
};

export const getMessages = async (
  conversationId: string
): Promise<{ success: boolean; messages: IMessage[] }> => {
  const { data } = await apiClient.get(MESSAGE_ENDPOINTS.MESSAGES(conversationId));
  return data;
};

export const getConversationById = async (
  conversationId: string
): Promise<{ success: boolean; conversation: IConversation }> => {
  const { data } = await apiClient.get(MESSAGE_ENDPOINTS.GET_ONE(conversationId));
  return data;
};
