export type RoomStatus = "Available" | "Booked";

export interface Room {
  id: number;
  name: string;
  bedType: string;
  floor: string;
  status: RoomStatus;
  addedBy: string;
}

export type RoomType =
  | "SINGLE"
  | "DOUBLE_SHARING"
  | "TRIPLE_SHARING"
  | "QUAD_SHARING"
  | "QUINT_SHARING"
  | "VIP_SUIT";

export interface CreateRoomForm {
  title: string;
  type: RoomType;
  floor: string;
  beds: number;
  washrooms: number;
  description: string;
  status?:"AVAILABLE"|"BOOKED"
}

export interface EditRoomForm {
  id: string;
  title: string;
  type: RoomType;
  floor: string;
  beds: number;
  washrooms: number;
  description: string;
  status?: "AVAILABLE" | "BOOKED";
  stayType?: "LONG_TERM" | "SHORT_TERM";
  price?: number;
  shortTermPrice?: number;
  longTermPrice?: number;
}

