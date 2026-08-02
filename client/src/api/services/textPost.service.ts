import apiClient from "../axiosConfig";
import { TEXT_POST_ENDPOINTS } from "../endpoints";
import type { ITextPost } from "../../types/TextPost";

export const getPostsFeed = async (): Promise<{ posts: ITextPost[] }> => {
  const res = await apiClient.get(TEXT_POST_ENDPOINTS.FEED);
  return res.data;
};

export const getPostsByUser = async (userId: string): Promise<{ posts: ITextPost[] }> => {
  const res = await apiClient.get(TEXT_POST_ENDPOINTS.BY_USER(userId));
  return res.data;
};

export const createTextPost = async (formData: FormData): Promise<{ post: ITextPost }> => {
  const res = await apiClient.post(TEXT_POST_ENDPOINTS.CREATE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const likeTextPost = async (
  id: string
): Promise<{ liked: boolean; likeCount: number }> => {
  const res = await apiClient.post(TEXT_POST_ENDPOINTS.LIKE(id));
  return res.data;
};

export const deleteTextPost = async (id: string): Promise<{ success: boolean }> => {
  const res = await apiClient.delete(TEXT_POST_ENDPOINTS.DELETE(id));
  return res.data;
};

export const getLikedTextPosts = async (): Promise<{ posts: ITextPost[] }> => {
  const res = await apiClient.get(TEXT_POST_ENDPOINTS.LIKED);
  return res.data;
};
