import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";
import { useChat } from "../hooks/useChat";
import type { INotification } from "../types/Notification";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../api/services/notification.service";

interface NotificationContextType {
  notifications: INotification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { onNotification } = useChat();

  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(() => {
    setIsLoading(true);
    getNotifications()
      .then((res) => {
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const unsubscribe = onNotification((notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return unsubscribe;
  }, [onNotification]);

  const markAsRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await markNotificationRead(id);
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);

    try {
      await markAllNotificationsRead();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, isLoading, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};