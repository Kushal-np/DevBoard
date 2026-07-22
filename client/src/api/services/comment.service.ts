import type { IComment } from "../../types/Comment";
import apiClient from "../axiosConfig";
import { COMMENT_ENDPOINTS } from "../endpoints";

interface GetCommentsResponse {
  success: boolean;
  comments: IComment[];
}

interface AddCommentResponse {
  success: boolean;
  comment: IComment;
}

export const getComments = async (projectId: string): Promise<GetCommentsResponse> => {
  const { data } = await apiClient.get<GetCommentsResponse>(COMMENT_ENDPOINTS.LIST(projectId));
  return data;
};

export const addComment = async (projectId: string, text: string): Promise<AddCommentResponse> => {
  const { data } = await apiClient.post<AddCommentResponse>(COMMENT_ENDPOINTS.LIST(projectId), { text });
  return data;
};

export const deleteComment = async (id: string): Promise<{ success: boolean }> => {
  const { data } = await apiClient.delete(COMMENT_ENDPOINTS.DELETE(id));
  return data;
};


