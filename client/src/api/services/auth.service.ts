import apiClient from "../axiosConfig";
import { AUTH_ENDPOINTS } from "../endpoints";

import type {
  LoginResponse,
  RegisterResponse,
  MeResponse,
} from "../../types/Auth";
interface LoginData {
  username: string;
  passwordHash: string;
}
export const loginUser = async (
  value: LoginData
): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>(
    AUTH_ENDPOINTS.LOGIN,
    
      value
    
  );

  return data;
};
interface RegisterData {
  name: string;
  username: string;
  email: string;
  passwordHash: string;
}

export const registerUser = async (
  value: RegisterData
): Promise<RegisterResponse> => {
  const { data } = await apiClient.post<RegisterResponse>(
    AUTH_ENDPOINTS.REGISTER,
    
      value
    
  );

  return data;
};

export const logoutUser = async (): Promise<void> => {
  await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
};

export const getCurrentUser = async (): Promise<MeResponse> => {
  const { data } = await apiClient.get<MeResponse>(
    AUTH_ENDPOINTS.GET_ME
  );

  return data;
};