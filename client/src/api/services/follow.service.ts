import type { FollowUser } from "../../types/follow";
import apiClient from "../axiosConfig";
import { FOLLOW_ENDPOINTS } from "../endpoints";

interface FollowResponse {
    success: boolean;
    message: string;
}
export interface FollowDataResponse {
  success: boolean;
  following: FollowUser[];
  followers: FollowUser[];
}
export const followUser = async (id: string): Promise<FollowResponse> => {
    const { data } = await apiClient.post<FollowResponse>(FOLLOW_ENDPOINTS.FOLLOW(id));
    return data;
}
export const unfollowUser = async (id: string): Promise<FollowResponse> =>{
    const {data} = await apiClient.post<FollowResponse>(FOLLOW_ENDPOINTS.UNFOLLOW(id));
    return data ; 
}
export const getFollowData = async (userId: string): Promise<FollowDataResponse> => {
  const res = await apiClient.get(FOLLOW_ENDPOINTS.GETFOLLOWDATA(userId));
  return res.data;
};