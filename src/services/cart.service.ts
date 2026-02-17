import apiClient from "./apiClient";

export type StayType = "SHORT_TERM" | "LONG_TERM";

export interface AddToCartPayload {
  roomId: string;
  stayType: StayType;
  selectedSeats: number;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity?: number;
  selectedSeats?: number;
}

export const cartService = {
  async getCart() {
    const response = await apiClient.get("/cart");
    return response.data?.data ?? response.data;
  },

  async addToCart(payload: AddToCartPayload) {
    const response = await apiClient.post("/cart/items", payload);
    console.log("Add to cart response:", response);
    return response.data?.data ?? response.data;
  },

  async updateCartItem(itemId: string, payload: UpdateCartItemPayload) {
    const response = await apiClient.patch(`/cart/items/${itemId}`, payload);
    return response.data?.data ?? response.data;
  },

  async removeCartItem(itemId: string) {
    const response = await apiClient.delete(`/cart/items/${itemId}`);
    return response.data?.data ?? response.data;
  },

  async clearCart() {
    const response = await apiClient.delete("/cart");
    return response.data?.data ?? response.data;
  },
};

export default cartService;
