import apiClient from "./apiClient";
import type { AllOrdersResponse, OrderDetailResponse } from "../types/order.types";

/**
 * Fetch all orders for the current logged-in user
 */
export const fetchUserOrders = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
  search?: string
) => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("limit", String(limit));
  if (status) params.append("status", status);
  if (search) params.append("search", search);

  const response = await apiClient.get<AllOrdersResponse>(
    `/bookings/orders?${params.toString()}`
  );
  return response.data;
};

/**
 * Fetch single order details by order ID
 */
export const fetchOrderDetails = async (orderId: string) => {
  const response = await apiClient.get<OrderDetailResponse>(
    `/bookings/order/${orderId}`
  );
  return response.data;
};

/**
 * Fetch latest order for banner
 */
export const fetchLatestOrder = async () => {
  const response = await apiClient.get<AllOrdersResponse>(
    `/bookings/my-orders?page=1&limit=1`
  );
  return response.data;
};

/**
 * Fetch user's own orders (my-orders endpoint)
 */
export const fetchUserMyOrders = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
  search?: string
) => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("limit", String(limit));
  if (status) params.append("status", status);
  if (search) params.append("search", search);

  const response = await apiClient.get<AllOrdersResponse>(
    `/bookings/my-orders?${params.toString()}`
  );
  return response.data;
};
