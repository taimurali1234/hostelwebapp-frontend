import type { RoomImage } from "../components/users/Rooms/RoomCard";
import { usePaginatedQuery } from "../hooks/useFetchApiQuerry";
import type { RoomStatus, RoomType } from "../types/room.types";

export interface Room {
  id: string;
  title: string;
  type: RoomType;
  floor: string;
  beds: number;
  washrooms: number;
  description: string;
  price?: number;
  stayType: "LONG_TERM" | "SHORT_TERM";
  status: RoomStatus;
  bookedSeats: number;
  images: RoomImage[];
}
export function useUserRooms(filters: any) {
  const params = new URLSearchParams({
    title: filters.title ?? "",
    status: filters.status ?? "",
    type: filters.type ?? "",
    page: String(filters.page ?? 1),
    limit: String(filters.limit ?? 10),
    sort: filters.sort ?? "createdAt_desc",
  });

  return usePaginatedQuery<Room>(
    "user-rooms",
    `/api/rooms?${params.toString()}`,
    "rooms"
  );
}
