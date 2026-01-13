import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { BookingRowType } from "../components/admin/Booking/BookingRow";
import apiClient from "../services/apiClient";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

interface BookingsFilters {
  search?: string;
  status?: string;
  bookingType?: string;
  source?: string;
  page?: number;
  limit?: number;
}

interface BackendBooking {
  id: string;
  userId: string;
  roomId: string;
  baseAmount: number;
  taxAmount?: number;
  discount?: number;
  couponCode?: string;
  bookingType: "SHORT_TERM" | "LONG_TERM";
  seatsSelected: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  source: string;
  checkIn: string;
  checkOut?: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  room: {
    id: string;
    title?: string;
    name?: string;
  };
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    name?: string;
  };
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
  status?: "PENDING" | "CONFIRMED" | "CANCELLED";
  seatsSelected?: number;
  totalAmount?: number;
}

// Transform backend booking data to BookingRowType
function transformBooking(booking: BackendBooking): BookingRowType {
  const userName =
    booking.user.firstName && booking.user.lastName
      ? `${booking.user.firstName} ${booking.user.lastName}`
      : booking.user.name || booking.user.email;

  const roomName = booking.room.title || booking.room.name || "Unknown Room";

  return {
    id: booking.id,
    bookingId: `BK-${booking.id.slice(0, 8).toUpperCase()}`,
    user: userName,
    room: roomName,
    seats: booking.seatsSelected,
    bookingType: booking.bookingType,
    status: booking.status,
    totalAmount: `₹${booking.totalAmount.toLocaleString()}`,
  };
}

export function useBookings(filters: BookingsFilters) {
  const params = new URLSearchParams({
    search: filters.search ?? "",
    status: filters.status ?? "",
    bookingType: filters.bookingType ?? "",
    source: filters.source ?? "",
    page: String(filters.page ?? 1),
    limit: String(filters.limit ?? 10),
  });

  return useQuery<BookingResponse>({
    queryKey: ["bookings", params.toString()],

    queryFn: async () => {
      const res = await apiClient.get(
        `/api/bookings?${params.toString()}`
      );
console.log("Bookings fetch response:", res);
      const data = res.data.data ?? res.data;

      return {
        items: (data.items || []).map(transformBooking),
        total: data.total,
        page: data.page,
        limit: data.limit,
      };
    },
    placeholderData: (prev) => prev,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateBookingPayload) => {
      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create booking");
      }

      return res.json();
    },
    onSuccess: () => {
      // Invalidate both list and single booking queries
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
      const res = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update booking");
      }

      return res.json();
    },
    onSuccess: () => {
      // Invalidate both list and single booking queries
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

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete booking");
      }

      return res.json();
    },
    onSuccess: () => {
      // Invalidate both list and single booking queries
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
