import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import cartService, {
  type AddToCartPayload,
  type UpdateCartItemPayload,
} from "@/services/cart.service";

export interface CartItem {
  id: string;
  roomId: string;
  room: {
    title: string;
    description?: string;
    beds: number;
    availableSeats: number;
    bookedSeats: number;
  };
  image?: {
    url: string;
  };
  stayType: "SHORT_TERM" | "LONG_TERM";
  selectedSeats: number;
  quantity: number;
  priceWithTax: number;
  total: number;
  addedAt: string;
  checkInDate?: string;
  checkOutDate?: string;
}

interface CartState {
  items: CartItem[];
  total?: number;
  subtotal?: number;
  totalItems?: number;
  itemCount?: number;
}

interface BookingContextType {
  cartItems: CartItem[];
  addToCart: (payload: AddToCartPayload) => Promise<void>;
  updateCartItem: (id: string, updates: Partial<CartItem>) => Promise<void>;
  removeCartItem: (id: string) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
  refreshCart: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | null>(null);

const toOptionalNumber = (value: unknown): number | undefined => {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const normalizeCartItem = (item: any): CartItem => ({
  ...item,
  id: item?.id || item?._id || "",
  roomId: item?.roomId || item?.room?.id || item?.room?._id || "",
  room: {
    ...item?.room,
    title: item?.room?.title || "",
    beds: Number(item?.room?.beds || 1),
    availableSeats: Number(item?.room?.availableSeats || 0),
    bookedSeats: Number(item?.room?.bookedSeats || 0),
  },
  stayType: item?.stayType || "SHORT_TERM",
  selectedSeats: Number(item?.selectedSeats || 0),
  quantity: Number(item?.quantity || 0),
  priceWithTax: Number(item?.priceWithTax || item?.pricePerUnit || 0),
  total: Number(item?.total || 0),
  addedAt: item?.addedAt || new Date().toISOString(),
});

const normalizeCart = (rawCart: any): CartState => {
  const source = rawCart?.cart || rawCart || {};
  const items = Array.isArray(source?.items)
    ? source.items
    : Array.isArray(source)
    ? source
    : [];

  const total = toOptionalNumber(source?.total ?? source?.totalAmount);
  const subtotal = toOptionalNumber(source?.subtotal);
  const totalItems = toOptionalNumber(source?.totalItems);
  const itemCount = toOptionalNumber(source?.itemCount);

  return {
    items: items.map(normalizeCartItem),
    total,
    subtotal,
    totalItems,
    itemCount,
  };
};

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartState>({ items: [] });

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [] });
      return;
    }

    const cartData = await cartService.getCart();
    console.log("Fetched cart data:", cartData);
    setCart(normalizeCart(cartData));
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setCart({ items: [] });
      return;
    }

    refreshCart().catch((error) => {
      console.error("Failed to fetch cart:", error);
      setCart({ items: [] });
    });
  }, [isAuthenticated, refreshCart]);

  const requireAuth = () => {
    if (!isAuthenticated) {
      throw new Error("Please log in to manage your cart");
    }
  };

  const addToCart = useCallback(
    async (payload: AddToCartPayload) => {
      requireAuth();
      await cartService.addToCart(payload);
      await refreshCart();
    },
    [refreshCart]
  );

  const updateCartItem = useCallback(
    async (id: string, updates: Partial<CartItem>) => {
      requireAuth();

      const payload: UpdateCartItemPayload = {};
      if (typeof updates.quantity === "number") {
        payload.quantity = updates.quantity;
      }
      if (typeof updates.selectedSeats === "number") {
        payload.selectedSeats = updates.selectedSeats;
      }

      if (Object.keys(payload).length === 0) {
        return;
      }

      await cartService.updateCartItem(id, payload);
      await refreshCart();
    },
    [refreshCart]
  );

  const removeCartItem = useCallback(
    async (id: string) => {
      requireAuth();
      await cartService.removeCartItem(id);
      await refreshCart();
    },
    [refreshCart]
  );

  const removeFromCart = useCallback(
    async (id: string) => {
      await removeCartItem(id);
    },
    [removeCartItem]
  );

  const clearCart = useCallback(async () => {
    requireAuth();
    await cartService.clearCart();
    await refreshCart();
  }, [refreshCart]);

  const getCartTotal = useCallback(() => {
    if (typeof cart.total === "number" && !Number.isNaN(cart.total)) {
      return cart.total;
    }
    return 0;
  }, [cart.total]);

  const getCartCount = useCallback(() => {
    if (typeof cart.totalItems === "number" && !Number.isNaN(cart.totalItems)) {
      return cart.totalItems;
    }
    if (typeof cart.itemCount === "number" && !Number.isNaN(cart.itemCount)) {
      return cart.itemCount;
    }
    return cart.items.length;
  }, [cart.itemCount, cart.items.length, cart.totalItems]);

  const value = useMemo(
    () => ({
      cartItems: cart.items,
      addToCart,
      updateCartItem,
      removeCartItem,
      removeFromCart,
      clearCart,
      getCartTotal,
      getCartCount,
      refreshCart,
    }),
    [
      addToCart,
      cart.items,
      clearCart,
      getCartCount,
      getCartTotal,
      refreshCart,
      removeCartItem,
      removeFromCart,
      updateCartItem,
    ]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within BookingProvider");
  }
  return context;
};
