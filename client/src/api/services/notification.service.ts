import apiClient from "../axiosConfig";
import { NOTIFICATION_ENDPOINTS } from "../endpoints";
import type { INotification } from "../../types/Notification";

export const getNotifications = async (): Promise<{
  success: boolean;
  notifications: INotification[];
  unreadCount: number;
}> => {
  const { data } = await apiClient.get(NOTIFICATION_ENDPOINTS.LIST);
  return data;
};

export const markNotificationRead = async (id: string) => {
  const { data } = await apiClient.patch(NOTIFICATION_ENDPOINTS.MARK_READ(id));
  return data;
};

export const markAllNotificationsRead = async () => {
  const { data } = await apiClient.patch(NOTIFICATION_ENDPOINTS.MARK_ALL_READ);
  return data;
};