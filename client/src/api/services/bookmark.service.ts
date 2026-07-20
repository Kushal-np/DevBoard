import type { IBookmark } from "../../types/Bookmark";
import apiClient from "../axiosConfig";
import { BOOKMARK_ENDPOINTS } from "../endpoints";

interface ToggleBookmarkResponse {
  success: boolean;
  bookmarked: boolean;
  message: string;
}

interface GetBookmarksResponse {
  success: boolean;
  projects: IBookmark["projectId"][];
  message: string;
}

export const toggleBookmark = async (projectId: string): Promise<ToggleBookmarkResponse> => {
  const { data } = await apiClient.post<ToggleBookmarkResponse>(
    BOOKMARK_ENDPOINTS.TOGGLE(projectId)
  );
  return data;
};

export const getBookmarks = async (): Promise<GetBookmarksResponse> => {
  const { data } = await apiClient.get<GetBookmarksResponse>(BOOKMARK_ENDPOINTS.GET_ALL);
  return data;
};

export const removeBookmark = async (projectId: string): Promise<{ success: boolean; message: string }> => {
  const { data } = await apiClient.delete(BOOKMARK_ENDPOINTS.TOGGLE(projectId));
  return data;
};
