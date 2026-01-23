import { usePaginatedQuery } from "../hooks/useFetchApiQuerry";

export interface OrderRowType {
  id: string;
  orderNumber: string;
  userId: string;
  user?: {
    name: string;
    email: string;
  };
  totalAmount: number;
  status: "PENDING" | "RESERVED" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  bookings?: any[];
  createdAt: string;
  updatedAt: string;
}

interface OrdersFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export function useOrders(filters: OrdersFilters) {
  const params = new URLSearchParams({
    search: filters.search ?? "",
    status: filters.status ?? "",
    page: String(filters.page ?? 1),
    limit: String(filters.limit ?? 10),
    sort: filters.sort ?? "createdAt_desc",
  });

  return usePaginatedQuery<OrderRowType>(
    "orders",
    `/bookings/orders?${params.toString()}`,
    "items"
  );
}
