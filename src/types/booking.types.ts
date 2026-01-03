export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";
export type BookingType = "SHORT_TERM" | "LONG_TERM";
export type BookingSource = "ADMIN";

export interface CreateBookingForm {
  userId: string;
  roomId: string;
  bookingType: BookingType;
  seatsSelected: number;
  checkIn: string;   // ISO date string
  checkOut?: string;
  baseAmount: number;
  taxAmount?: number;
  discount?: number;
  status: BookingStatus;
  source: BookingSource;
}
