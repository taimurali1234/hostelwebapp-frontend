import type { UserRowType } from "../components/admin/Users/UsersRow";
import { usePaginatedQuery } from "../hooks/useFetchApiQuerry";

interface UsersFilters {
  search?: string;
  role?: string;
  verified?: string;
  page?: number;
  limit?: number;
}

export function useUsers(filters: UsersFilters) {
  const params = new URLSearchParams({
    search: filters.search ?? "",
    role: filters.role ?? "",
    verified: filters.verified ?? "",
    page: String(filters.page ?? 1),
    limit: String(filters.limit ?? 10),
  });

  return usePaginatedQuery<UserRowType>(
    "users",                       // query key
    `/api/users?${params.toString()}`,
    "users"                        // itemsKey
  );
}
