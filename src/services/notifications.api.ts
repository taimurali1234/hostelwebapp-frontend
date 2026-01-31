import type { BackendSeverity } from "@/types/notification.types";
import apiClient from "./apiClient";

export interface Notification {
  id: string;
  title: string;
  message: string;
  audience: "USER" | "ADMIN" | "ALL_USERS";
  userId?: string | null;
  severity: BackendSeverity
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  message: string;
  data: {
    notifications: Notification[];
    total: number;
    page: number;
    limit: number;
  };
}

/**
 * Fetch user's notifications
 */
export const fetchMyNotifications = async (
  page: number = 1,
  limit: number = 10,
  filters?: {
    search?: string;
    audience?: string;
    severity?: string;
    read?: string;
  }
) => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("limit", String(limit));
  if (filters?.search) params.append("search", filters.search);
  if (filters?.audience) params.append("audience", filters.audience);
  if (filters?.severity) params.append("severity", filters.severity);
  if (filters?.read) params.append("read", filters.read);

  const response = await apiClient.get<NotificationsResponse>(
    `/notifications?${params.toString()}`
  );
  return response.data;
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId: string) => {
  const response = await apiClient.patch(`/notifications/${notificationId}/read`);
  console.log("markNotificationAsRead response:", response);
  return response.data;
};

/**
 * Create notification (admin only)
 */
export const createNotification = async (data: {
  audience: "USER" | "ADMIN" | "ALL_USERS";
  userId?: string;
  title: string;
  message: string;
  severity: BackendSeverity;
}) => {
  const response = await apiClient.post("/notifications", data);
  return response.data;
};

/**
 * Delete notification (admin only)
 */
export const deleteNotification = async (notificationId: string) => {
  const response = await apiClient.delete(`/notifications/${notificationId}`);
  return response.data;
};

export const markAllNotificationsAsRead = () => {
  return apiClient.patch("/notifications/read-all");
};

