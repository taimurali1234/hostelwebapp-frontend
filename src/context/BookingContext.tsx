import { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string; // Unique cart item ID
  roomId: string;
  room: {
    title: string;
    description?: string;
    beds: number;
    availableSeats: number;
    bookedSeats: number; // Number of beds in the room (max seats allowed)
  };
  image?: {
    url: string;
  };
  stayType: "SHORT_TERM" | "LONG_TERM";
  selectedSeats: number; // Number of seats selected (1 to room.beds)
  quantity: number; // Number of rooms/items
  priceWithTax: number; // Final price per room INCLUDING tax (this is what should be multiplied)
  total: number; // Total for this item (quantity * priceWithTax * selectedSeats)
  addedAt: string; // ISO timestamp
  checkInDate?: string; // Optional check-in date
  checkOutDate?: string; // Optional check-out date
}

interface BookingContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartItem: (id: string, updates: Partial<CartItem>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const BookingContext = createContext<BookingContextType | null>(null);

/**
 * Migrate old cart items to new format
 * Old items have 'pricePerUnit', new items have 'priceWithTax'
 */
const migrateCartItems = (items: any[]): CartItem[] => {
  return items.map((item) => ({
    ...item,
    // Fallback: if priceWithTax doesn't exist, use pricePerUnit
    priceWithTax: item.priceWithTax || item.pricePerUnit || 0,
    // Ensure room has beds property
    room: {
      ...item.room,
      beds: item.room?.beds || 1, // Default to 1 if not specified
    },
  }));
};

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem("bookingCart");
      const items = stored ? JSON.parse(stored) : [];
      // Migrate old items to new format
      return migrateCartItems(items);
    } catch {
      return [];
    }
  });

  // 💾 Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem("bookingCart", JSON.stringify(cartItems));
  }, [cartItems]);

  /**
   * ➕ Add item to cart (or update quantity if already exists)
   */
  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      // Check if room with same seats already exists
      const existingIndex = prev.findIndex(
        (ci) =>
          ci.roomId === item.roomId &&
          ci.selectedSeats === item.selectedSeats &&
          ci.stayType === item.stayType
      );

      if (existingIndex > -1) {
        // Update quantity
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity;
        // ✅ Use priceWithTax (includes tax) * quantity * selectedSeats
        updated[existingIndex].total = 
          updated[existingIndex].quantity * 
          updated[existingIndex].priceWithTax * 
          updated[existingIndex].selectedSeats;
        return updated;
      }

      // Add new item
      return [...prev, item];
    });
  };

  /**
   * ✏️ Update cart item (quantity, seats, etc.)
   */
  const updateCartItem = (id: string, updates: Partial<CartItem>) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, ...updates };

        // Recalculate total if quantity or selectedSeats changed
        // ✅ Always use priceWithTax (includes tax) * quantity * selectedSeats
        if (updates.quantity || updates.selectedSeats) {
          updated.total =
            (updated.quantity || item.quantity) *
            (updated.priceWithTax || item.priceWithTax) *
            (updated.selectedSeats || item.selectedSeats);
        }

        return updated;
      })
    );
  };

  /**
   * 🗑️ Remove item from cart
   */
  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  /**
   * 🧹 Clear entire cart
   */
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("bookingCart");
  };

  /**
   * 💰 Get total cart amount
   */
  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.total, 0);
  };

  /**
   * 📦 Get total items in cart
   */
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <BookingContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within BookingProvider");
  }
  return context;
};
