/**
 * Helper function to add a room to cart from SingleRoom page
 * This ensures proper pricing with tax and bed validation
 * 
 * Usage in SingleRoom.tsx:
 * 
 * import { addRoomToCart } from '@/utils/cartHelper';
 * 
 * const handleAddToCart = async () => {
 *   const roomData = {
 *     id: room.id,
 *     title: room.title,
 *     beds: room.beds,
 *     image: room.image,
 *     finalPriceWithTax: 12000, // This is the total price including 16% tax
 *     stayType: selectedStayType, // "SHORT_TERM" or "LONG_TERM"
 *   };
 *   
 *   addRoomToCart(roomData, 1, 1); // quantity, selectedSeats defaults
 * };
 */

import { CartItem } from "@/context/BookingContext";

export interface RoomToAdd {
  id: string;
  title: string;
  beds: number;
  image?: { url: string };
  finalPriceWithTax: number; // Price with 16% tax already included
  stayType: "SHORT_TERM" | "LONG_TERM";
  description?: string;
}

/**
 * Add room to cart with proper tax-inclusive pricing
 * @param room - Room data including bed count and tax-inclusive price
 * @param quantity - Number of rooms to add (default: 1)
 * @param selectedSeats - Initial seat count (default: 1, max: room.beds)
 */
export const addRoomToCart = (
  room: RoomToAdd,
  quantity: number = 1,
  selectedSeats: number = 1
): CartItem => {
  // Validate seats against beds
  const finalSeats = Math.min(Math.max(selectedSeats, 1), room.beds);

  // Generate unique ID for cart item
  const cartId = `${room.id}-${finalSeats}-${Date.now()}`;

  // Calculate total: price (with tax) × quantity × seats
  const total = room.finalPriceWithTax * quantity * finalSeats;

  const cartItem: CartItem = {
    id: cartId,
    roomId: room.id,
    room: {
      title: room.title,
      description: room.description,
      beds: room.beds, // ✅ Store bed count for validation
    },
    image: room.image,
    stayType: room.stayType,
    selectedSeats: finalSeats,
    quantity,
    priceWithTax: room.finalPriceWithTax, // ✅ Tax-inclusive price
    total,
    addedAt: new Date().toISOString(),
  };

  return cartItem;
};

/**
 * Validate seat count doesn't exceed bed count
 */
export const validateSeats = (
  selectedSeats: number,
  maxBeds: number
): number => {
  return Math.min(Math.max(selectedSeats, 1), maxBeds);
};

/**
 * Calculate cart item total
 * Formula: priceWithTax × quantity × selectedSeats
 */
export const calculateTotal = (
  priceWithTax: number,
  quantity: number,
  selectedSeats: number
): number => {
  return priceWithTax * quantity * selectedSeats;
};
