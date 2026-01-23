import type { NotificationRowType } from "../components/admin/Notifications/NotificationRow";
import { usePaginatedQuery } from "../hooks/useFetchApiQuerry";

interface NotificationsFilters {
  search?: string;
  audience?: string;
  severity?: string;
  read?: string;
  page?: number;
  limit?: number;
}

export function useNotifications(filters: NotificationsFilters) {
  const params = new URLSearchParams({
    search: filters.search ?? "",
    audience: filters.audience ?? "",
    severity: filters.severity ?? "",
    read: filters.read ?? "",
    page: String(filters.page ?? 1),
    limit: String(filters.limit ?? 10),
  });

  return usePaginatedQuery<NotificationRowType>(
    "notifications",
    `/notifications?${params.toString()}`,
    "notifications"
  );
}
