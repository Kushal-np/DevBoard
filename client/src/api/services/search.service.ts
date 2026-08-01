import apiClient from "../axiosConfig";
import { SEARCH_ENDPOINTS } from "../endpoints";

export const searchUsers = async (q: string) => {
  const res = await apiClient.get(SEARCH_ENDPOINTS.USERS, { params: { q } });
  return res.data;
};

export const searchPosts = async (q: string) => {
  const res = await apiClient.get(SEARCH_ENDPOINTS.POSTS, { params: { q } });
  return res.data;
};

export const searchByTag = async (tag: string) => {
  const res = await apiClient.get(SEARCH_ENDPOINTS.TAGS, { params: { tag } });
  return res.data;
};