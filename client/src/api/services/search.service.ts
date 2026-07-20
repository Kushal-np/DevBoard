import apiClient from "../axiosConfig";
import { SEARCH_ENDPOINTS } from "../endpoints";

export const searchUsers = async (q: string) => {
  const { data } = await apiClient.get(SEARCH_ENDPOINTS.USERS, { params: { q } });
  return data;
};

export const searchPosts = async (q: string) => {
  const { data } = await apiClient.get(SEARCH_ENDPOINTS.POSTS, { params: { q } });
  return data;
};

export const searchByTag = async (tag: string) => {
  const { data } = await apiClient.get(SEARCH_ENDPOINTS.TAGS, { params: { tag } });
  return data;
};
