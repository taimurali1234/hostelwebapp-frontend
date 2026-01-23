import type { RoomRowType } from "../components/admin/Rooms/RoomsRow";
import { usePaginatedQuery } from "../hooks/useFetchApiQuerry";

interface RoomsFilters {
  title?: string;
  beds?: number | "";
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}

export function useRooms(filters: RoomsFilters) {
  const params = new URLSearchParams({
    title: filters.title ?? "",
    status: filters.status ?? "",
    type: filters.type ?? "",
    minPrice: String(filters.minPrice ?? ""),
    maxPrice: String(filters.maxPrice ?? ""),
    page: String(filters.page ?? 1),
    limit: String(filters.limit ?? 10),
    sort: filters.sort ?? "createdAt_desc",
  });

  if (filters.beds !== "" && filters.beds !== undefined) {
    params.set("beds", String(filters.beds));
  }

  return usePaginatedQuery<RoomRowType>(
    "rooms",
    `/rooms?${params.toString()}`,
    "rooms"
  );
}
