import { useEffect, useState } from "react";
import { fetchUserMyOrders } from "../services/orders.api";
import type { OrderItem } from "../types/order.types";

interface UseUserOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

interface UseUserOrdersReturn {
  orders: OrderItem[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  refetch: (params: UseUserOrdersParams) => Promise<void>;
}

export const useUserOrders = (initialParams?: UseUserOrdersParams): UseUserOrdersReturn => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialParams?.page || 1);
  const [limit, setLimit] = useState(initialParams?.limit || 10);
  const [status, setStatus] = useState(initialParams?.status || "");
  const [search, setSearch] = useState(initialParams?.search || "");

  const loadOrders = async (
    pageNum: number = page,
    limitNum: number = limit,
    statusFilter: string = status,
    searchQuery: string = search
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchUserMyOrders(pageNum, limitNum, statusFilter, searchQuery);
      setOrders(response.data?.items || []);
      setTotal(response.data?.total || 0);
      setPage(response.data?.page || pageNum);
      setLimit(response.data?.limit || limitNum);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(page, limit, status, search);
  }, [page, limit, status, search]);

  const refetch = async (params: UseUserOrdersParams = {}) => {
    const newPage = params.page ?? page;
    const newLimit = params.limit ?? limit;
    const newStatus = params.status ?? status;
    const newSearch = params.search ?? search;

    setPage(newPage);
    setLimit(newLimit);
    setStatus(newStatus);
    setSearch(newSearch);

    await loadOrders(newPage, newLimit, newStatus, newSearch);
  };

  return { orders, loading, error, total, page, limit, refetch };
};
