import apiClient from "../axiosConfig";
import { PROFILE_ENDPOINTS } from "../endpoints";
import type { ISocialMedia } from "../../types/Auth";

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
  socialMedia?: ISocialMedia;
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

export interface EditProfilePayload {
  name?: string;
  bio?: string;
  socialMedia?: Partial<ISocialMedia>;
}

export async function editProfile(payload: EditProfilePayload): Promise<IProfileApiResponse> {
  const res = await apiClient.patch<IProfileApiResponse>(PROFILE_ENDPOINTS.EDIT, payload);
  return res.data;
}

export async function editProfileWithImages(formData: FormData): Promise<IProfileApiResponse> {
  const res = await apiClient.patch<IProfileApiResponse>(PROFILE_ENDPOINTS.EDIT, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export async function changePassword(
  payload: ChangePasswordPayload
): Promise<{ success: boolean; message: string }> {
  const res = await apiClient.patch(PROFILE_ENDPOINTS.CHANGE_PASSWORD, payload);
  return res.data;
}

export async function deleteAccount(): Promise<{ success: boolean; message: string }> {
  const res = await apiClient.delete(PROFILE_ENDPOINTS.DELETE_ACCOUNT);
  return res.data;
}
