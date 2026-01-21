export type RoomType = "SINGLE" | "DOUBLE_SHARING" | "TRIPLE_SHARING" | "QUAD_SHARING" | "QUINT_SHARING" | "VIP_SUIT";
export type StayType = "SHORT_TERM" | "LONG_TERM";

export interface RoomPricing {
  id: string;
  roomType: RoomType;
  stayType: StayType;
  price: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoomPricingRowType {
  id: string;
  roomType: RoomType;
  stayType: StayType;
  price: number;
  isActive: boolean;
}

export interface CreateRoomPricingForm {
  roomType: RoomType;
  stayType: StayType;
  price: number;
  isActive?: boolean;
}

export interface EditRoomPricingForm {
    id?: string;
  roomType?: RoomType;
  stayType?: StayType;
  price?: number;
  isActive?: boolean;
}
