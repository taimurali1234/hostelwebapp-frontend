import apiClient from "./apiClient";
import { CreateBookingForm } from "@/types/booking.types";

export const bookingApi = {
  /**
   * Create multiple bookings at once
   */
  createMultiple: async (bookings: CreateBookingForm[]) => {
    const response = await apiClient.post("/bookings/create-multiple", {
      bookings,
    });
    return response.data;
  },

  /**
   * Create single booking
   */
  createBooking: async (booking: CreateBookingForm) => {
    const response = await apiClient.post("/bookings", booking);
    return response.data;
  },

  /**
   * Get user's bookings
   */
  getUserBookings: async (userId: string, status?: string) => {
    const params = new URLSearchParams();
    params.append("userId", userId);
    if (status) params.append("status", status);

    const response = await apiClient.get(`/bookings/user/${userId}?${params}`);
    return response.data;
  },

  /**
   * Get booking by ID
   */
  getBookingById: async (bookingId: string) => {
    const response = await apiClient.get(`/bookings/${bookingId}`);
    return response.data;
  },

  /**
   * Update booking status
   */
  updateBookingStatus: async (
    bookingId: string,
    status: "RESERVED" | "CONFIRMED" | "CANCELLED"
  ) => {
    const response = await apiClient.patch(`/bookings/${bookingId}`, {
      status,
    });
    return response.data;
  },

  /**
   * Cancel booking
   */
  cancelBooking: async (bookingId: string) => {
    const response = await apiClient.post(`/bookings/${bookingId}/cancel`);
    return response.data;
  },

  /**
   * Process payment and confirm booking
   */
  processPayment: async (bookingId: string, paymentData: any) => {
    const response = await apiClient.post(
      `/bookings/${bookingId}/payment`,
      paymentData
    );
    return response.data;
  },

  /**
   * Get available rooms for date range
   */
  getAvailableRooms: async (
    checkIn: string,
    checkOut?: string,
    stayType?: "SHORT_TERM" | "LONG_TERM"
  ) => {
    const params = new URLSearchParams();
    params.append("checkIn", checkIn);
    if (checkOut) params.append("checkOut", checkOut);
    if (stayType) params.append("stayType", stayType);

    const response = await apiClient.get(`/bookings/available?${params}`);
    return response.data;
  },
};

export default bookingApi;
