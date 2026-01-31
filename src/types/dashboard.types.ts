export interface SeatDataByRoomType {
  roomType: string;
  totalRooms: number;
  totalSeats: number;
  occupiedSeats: number;
  availableSeats: number;
}

export interface FloorStatusData {
  floorName: string;
  totalRooms: number;
  totalSeats: number;
  occupiedSeats: number;
  availableSeats: number;
}

export interface BookingList {
  id: string;
  status: string;
  baseAmount: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  room: {
    id: string;
    title: string;
    type: string;
    floor: string;
    beds: number;
  };
  bookingOrder: {
    id: string;
    orderNumber: string;
  };
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  room: {
    id: string;
    title: string;
    type: string;
  };
}

export interface DashboardData {
  success: boolean;
  message: string;
  data: {
    summary: {
      todayBookedRooms: number;
      pendingBookingsCount: number;
      availableRoomsCount: number;
      occupiedRoomsCount: number;
      totalRevenue: number;
    };
    bookings: {
      pending: {
        count: number;
        list: BookingList[];
      };
      confirmed: {
        count: number;
        list: BookingList[];
      };
    };
    roomOccupancy: {
      totalRooms: number;
      availableRooms: number;
      occupiedRooms: number;
      seatsByRoomType: SeatDataByRoomType[];
    };
    floorStatus: FloorStatusData[];
    reviews: {
      approvedCount: number;
      pendingCount: number;
      totalCount: number;
      recentReviews: Review[];
    };
  };
}
