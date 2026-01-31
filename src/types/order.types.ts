export type BookingStatus = "PENDING" | "RESERVED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type BookingType = "SHORT_TERM" | "LONG_TERM";

export interface OrderUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface OrderRoom {
  id: string;
  title: string;
  type: string;
  floor: string;
  beds: number;
  images?: any[];
  videos?: any[];
}

export interface OrderBooking {
  id: string;
  userId: string;
  roomId: string;
  bookingType: BookingType;
  checkIn: string | Date;
  checkOut: string | Date | null;
  seatsSelected: number;
  baseAmount: number;
  taxAmount: number;
  discount: number;
  status: BookingStatus;
  cancelledAt?: string | Date | null;
  room: OrderRoom;
}

export interface OrderItem {
  id: string;
  userId: string;
  orderNumber: string;
  totalAmount: number;
  status: BookingStatus;
  createdAt: string | Date;
  updatedAt?: string | Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
  bookings: Array<{ id: string }>;
}

export interface OrderDetail {
  id: string;
  userId: string;
  orderNumber: string;
  totalAmount: number;
  status: BookingStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
  user: OrderUser;
  bookings: OrderBooking[];
}

export interface AllOrdersResponse {
  success: boolean;
  message: string;
  data: {
    items: OrderItem[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface OrderDetailResponse {
  success: boolean;
  data: OrderDetail;
}
