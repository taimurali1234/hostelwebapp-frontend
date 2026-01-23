import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateNotificationForm } from "../components/admin/Notifications/AddNotificationModel";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface NotificationData extends CreateNotificationForm {
  id?: string;
}

/**
 * Create new notification
 */
export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNotificationForm) => {
      const response = await fetch(`${API_BASE}/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create notification");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate notifications queries to refetch
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

/**
 * Update existing notification
 */
export function useUpdateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateNotificationForm>;
    }) => {
      const response = await fetch(`${API_BASE}/notifications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update notification");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate notifications queries to refetch
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

/**
 * Delete notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE}/notifications/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete notification");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate notifications queries to refetch
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

/**
 * Mark notification as read
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(
        `${API_BASE}/notifications/${id}/mark-as-read`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to mark as read");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate notifications queries to refetch
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["myNotifications"] });
    },
  });
}
