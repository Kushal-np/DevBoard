import axios from "axios";
import type { ISocialMedia } from "../../types/Auth";
import apiClient from "../axiosConfig";
import { PROFILE_ENDPOINTS } from "../endpoints";


export interface IProfileResponse {
  _id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  profile_url: string;
  cover_url: string;
  followers: string[];
  following: string[];
  followerCount: number;
  followingCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IProfileApiResponse {
  success: boolean;
  user: IProfileResponse;
}

export async function ProfileData(username: string): Promise<IProfileApiResponse> {
  const res = await apiClient.get<IProfileApiResponse>(PROFILE_ENDPOINTS.GET_PROFILE(username));
  return res.data;
}