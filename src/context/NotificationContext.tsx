import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  fetchMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/services/notifications.api";
import type { Notification } from "@/services/notifications.api";
import { initializeSocket } from "@/services/socket";
import { showNotificationToast } from "@/utils/notificationToast";
import { useAuth } from "./AuthContext";
import { mapBackendSeverityToToast } from "@/utils/SeverityMappper";

/* ============================================
   📊 CONTEXT TYPE DEFINITION
   ============================================ */
interface NotificationContextType {
  // State
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;

  // Actions
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  reloadNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

/* ============================================
   🏗️ CONTEXT PROVIDER
   ============================================ */
export const NotificationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useAuth();

  // Notification state - backend is source of truth
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  /* ============================================
     📦 INITIAL LOAD & RECOVERY
     ============================================
     Fetch notifications from backend on login.
     This recovers any missed socket events.
  */
  const reloadNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      setLoading(true);

      // Fetch with higher limit for admin/coordinator
      const limit = user?.role === "ADMIN" || user?.role === "COORDINATOR" ? 50 : 20;

      const response = await fetchMyNotifications(1, limit);
      const fetchedNotifications = response.data.notifications || [];

      // ✅ Backend is source of truth - set state directly
      setNotifications(fetchedNotifications);

      // ✅ Calculate unread count from backend data
      // Each notification has user-specific isRead value
      const unread = fetchedNotifications.filter((n) => !n.isRead).length;
      setUnreadCount(unread);

      console.log("✅ Notifications loaded:", {
        total: fetchedNotifications.length,
        unread,
        userRole: user.role,
      });
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        console.error("❌ Failed to load notifications:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  /* ============================================
     🔔 SOCKET.IO REAL-TIME LISTENER
     ============================================
     Listen for NEW notifications only.
     DO NOT mark as read on receive.
     Prepend to list and increment unread count.
  */
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    // Initial load from backend
    reloadNotifications();

    // Initialize socket connection
    const socket = initializeSocket();

    // Remove any old listeners
    socket.off("notification:new");

    // Listen for new notifications
    socket.on("notification:new", (newNotification: Notification) => {
      console.log("📬 New notification received via socket:", newNotification);

      // ✅ PREPEND new notification to list (most recent first)
      setNotifications((prev) => [newNotification, ...prev]);

      // ✅ INCREMENT unread count
      // New notifications arrive as isRead: false
      if (!newNotification.isRead) {
        setUnreadCount((prev) => prev + 1);
      }

      // ✅ SHOW TOAST
      const toastSeverity = mapBackendSeverityToToast(
        newNotification.severity
      );
      showNotificationToast({
        title: newNotification.title,
        message: newNotification.message,
        severity: toastSeverity,
      });
    });

    return () => {
      socket.off("notification:new");
    };
  }, [user, reloadNotifications]);

  /* ============================================
     ✅ MARK SINGLE NOTIFICATION AS READ
     ============================================
     1. Call backend API
     2. Update ONLY that notification's isRead
     3. Decrement unread count
  */
  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        // Find notification to check current state
        const notification = notifications.find((n) => n.id === notificationId);
        if (!notification) {
          console.warn("Notification not found:", notificationId);
          return;
        }

        // Only call API if not already read
        if (notification.isRead) {
          return;
        }

        // Call backend API
        await markNotificationAsRead(notificationId);

        // ✅ Update ONLY this notification's isRead state
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );

        // ✅ Decrement unread count
        setUnreadCount((prev) => Math.max(prev - 1, 0));

        console.log("✅ Notification marked as read:", notificationId);
      } catch (err) {
        console.error("❌ Failed to mark notification as read:", err);
      }
    },
    [notifications]
  );

  /* ============================================
     ✅ MARK ALL NOTIFICATIONS AS READ
     ============================================
     1. Call backend API
     2. Mark ALL notifications as read in state
     3. Set unread count to 0
  */
  const markAllAsRead = useCallback(async () => {
    try {
      // Call backend API - marks all unread for logged-in user
      await markAllNotificationsAsRead();

      // ✅ Update ALL notifications to isRead: true
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );

      // ✅ Set unread count to 0
      setUnreadCount(0);

      console.log("✅ All notifications marked as read");
    } catch (err) {
      console.error("❌ Failed to mark all as read:", err);
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        reloadNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

/* ============================================
   🎣 CUSTOM HOOK
   ============================================ */
export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  }
  return ctx;
};
