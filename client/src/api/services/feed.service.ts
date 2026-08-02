
import type { IPost } from "../../types/Post";
import apiClient from "../axiosConfig";
import { POST_ENDPOINTS } from "../endpoints";

export interface Tag {
  name: string;
  category: string;
}

export interface PostData {
  title: string;
  description: string;
  liveUrl: string;
  repoUrl: string;
  techStack: string[];
  tags: Tag[];
  status: string;
  thumbnail: File | null;
}

interface PostResponse {
  success: boolean;
  message: string;
  Projects: IPost;
}

export const createPost = async (formData: FormData): Promise<PostResponse> => {
  const { data } = await apiClient.post<PostResponse>(POST_ENDPOINTS.CREATE_POST, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

interface GetPostsResponse {
  success: boolean;
  Projects: IPost[];
  message: string;
}

export const GetPost = async (): Promise<GetPostsResponse> => {
  const { data } = await apiClient.get<GetPostsResponse>(POST_ENDPOINTS.GET_POST);
  return data;
};

interface IndividualPostResponse {
  success: boolean;
  post: IPost;
}

export const getIndividualPost = async (value: string): Promise<IndividualPostResponse> => {
  const { data } = await apiClient.get<IndividualPostResponse>(
    POST_ENDPOINTS.GET_INDIVIDUAL_POST(value)
  );
  return data;
};

interface StarResponse {
  success: boolean;
  starred: boolean;
  starCount: number;
  message: string;
}

export const LikePost = async (value: string): Promise<StarResponse> => {
  const { data } = await apiClient.post<StarResponse>(POST_ENDPOINTS.STAR_POST(value));
  return data;
};

interface FeaturedResponse {
  success: boolean;
  projects: IPost[];
  message: string;
}

export const getFeaturedPosts = async (): Promise<FeaturedResponse> => {
  const { data } = await apiClient.get<FeaturedResponse>(POST_ENDPOINTS.GET_FEATURED);
  return data;
};

export const getExplorePosts = async (): Promise<FeaturedResponse> => {
  const { data } = await apiClient.get<FeaturedResponse>(POST_ENDPOINTS.GET_EXPLORE);
  return data;
};

export const updatePost = async (
  id: string,
  formData: FormData
): Promise<{ success: boolean; project: IPost; message: string }> => {
  const { data } = await apiClient.patch(POST_ENDPOINTS.UPDATE_POST(id), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deletePost = async (id: string): Promise<{ success: boolean; message: string }> => {
  const { data } = await apiClient.delete(POST_ENDPOINTS.DELETE_POST(id));
  return data;
};
