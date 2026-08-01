import apiClient from "../axiosConfig";
import { COMMENT_ENDPOINTS } from "../endpoints";
import type { IChatUser } from "../../types/Message";

export interface IComment {
  _id: string;
  projectId: string;
  userId: IChatUser;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export const createComment = async (
  projectId: string,
  text: string
): Promise<{ success: boolean; comment: IComment }> => {
  const { data } = await apiClient.post(COMMENT_ENDPOINTS.CREATE(projectId), { text });
  return data;
};

export const getComments = async (
  projectId: string
): Promise<{ success: boolean; comments: IComment[] }> => {
  const { data } = await apiClient.get(COMMENT_ENDPOINTS.LIST(projectId));
  return data;
};

export const deleteComment = async (id: string): Promise<{ success: boolean }> => {
  const { data } = await apiClient.delete(COMMENT_ENDPOINTS.DELETE(id));
  return data;
};