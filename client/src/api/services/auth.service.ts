import apiClient from "../axiosConfig";
import { AUTH_ENDPOINTS } from "../endpoints";

import type {
  LoginResponse,
  RegisterResponse,
  MeResponse,
} from "../../types/Auth";

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>(
    AUTH_ENDPOINTS.LOGIN,
    {
      username,
      password,
    }
  );

  return data;
};

export const register = async (
  name: string,
  username: string,
  email: string,
  password: string
): Promise<RegisterResponse> => {
  const { data } = await apiClient.post<RegisterResponse>(
    AUTH_ENDPOINTS.REGISTER,
    {
      name,
      username,
      email,
      password,
    }
  );

  return data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
};

export const getCurrentUser = async (): Promise<MeResponse> => {
  const { data } = await apiClient.get<MeResponse>(
    AUTH_ENDPOINTS.GET_ME
  );

  return data;
};