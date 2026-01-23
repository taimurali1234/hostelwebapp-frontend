import type { RoomPricingRowType } from "../types/roomPricing.types";
import { usePaginatedQuery } from "../hooks/useFetchApiQuerry";

interface RoomPricingFilters {
  roomType?: string;
  stayType?: string;
  isActive?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export function useRoomPricing(filters: RoomPricingFilters) {
  const params = new URLSearchParams({
    roomType: filters.roomType ?? "",
    stayType: filters.stayType ?? "",
    isActive: filters.isActive ?? "",
    page: String(filters.page ?? 1),
    limit: String(filters.limit ?? 10),
    sort: filters.sort ?? "createdAt_desc",
  });

  return usePaginatedQuery<RoomPricingRowType>(
    "roomPricing",
    `/seat-pricing?${params.toString()}`,
    "seatPricings"
  );
}
