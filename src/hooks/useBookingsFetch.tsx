import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { BookingRowType } from "../components/admin/Booking/BookingRow";
import apiClient from "../services/apiClient";

/* ---------------- Types ---------------- */

interface BookingsFilters {
  search?: string;
  status?: string;
  bookingType?: string;
  source?: string;
  page?: number;
  limit?: number;
  orderId?: string | null;
}

interface BookingResponse {
  items: BookingRowType[];
  total: number;
  page: number;
  limit: number;
}

interface CreateBookingPayload {
  userId: string;
  roomId: string;
  seatsSelected: number;
  bookingType: "SHORT_TERM" | "LONG_TERM";
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
}

interface UpdateBookingPayload {
  status?: "PENDING" | "RESERVED" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  seatsSelected?: number;
  totalAmount?: number;
}

/* ---------------- Transformer ---------------- */

function transformBooking(booking: any): BookingRowType {
  const userName =
    booking.user?.firstName && booking.user?.lastName
      ? `${booking.user.firstName} ${booking.user.lastName}`
      : booking.user?.name || booking.user?.email || "Unknown User";

  const roomName =
    booking.room?.title || booking.room?.name || "Unknown Room";

  return {
    id: booking.id,
    bookingId: `BK-${booking.id.slice(0, 8).toUpperCase()}`,
    user: userName,
    room: roomName,
    seats: booking.seatsSelected,
    bookingType: booking.bookingType,
    status: booking.status,
    baseAmount: `PKR-${booking.baseAmount.toLocaleString()}`,
    orderNumber: booking.bookingOrder?.orderNumber || "N/A",
    bookingOrderId:
      booking.bookingOrderId || booking.bookingOrder?.id,
  };
}

/* ---------------- Fetch Bookings ---------------- */

export function useBookings(filters: BookingsFilters) {
  const params = new URLSearchParams({
    search: filters.search ?? "",
    status: filters.status ?? "",
    bookingType: filters.bookingType ?? "",
    source: filters.source ?? "",
    page: String(filters.page ?? 1),
    limit: String(filters.limit ?? 10),
  });

  if (filters.orderId) {
    params.set("orderId", filters.orderId);
  }

  return useQuery<BookingResponse>({
    queryKey: ["bookings", params.toString()],
    queryFn: async () => {
      const res = await apiClient.get(
        `/bookings?${params.toString()}`
      );

      const data = res.data.data ?? res.data;
      const items = (data.items || []).map(transformBooking);

      return {
        items,
        total: data.total ?? items.length,
        page: filters.page ?? 1,
        limit: filters.limit ?? 10,
      };
    },
    placeholderData: (prev) => prev,
  });
}

/* ---------------- Create Booking ---------------- */

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateBookingPayload) => {
      const res = await apiClient.post("/bookings", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["booking"],
        exact: false,
      });
    },
  });
}

/* ---------------- Update Booking ---------------- */

export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateBookingPayload;
    }) => {
      const res = await apiClient.patch(
        `/bookings/${id}`,
        payload
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["booking"],
        exact: false,
      });
    },
  });
}

/* ---------------- Delete Booking ---------------- */

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(
        `/bookings/${id}`
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["booking"],
        exact: false,
      });
    },
  });
}
