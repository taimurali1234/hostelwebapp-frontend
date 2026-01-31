import { useEffect, useState } from "react";
import { fetchLatestOrder } from "../services/orders.api";
import {type OrderItem } from "../types/order.types";

export const useLatestOrder = () => {
  const [order, setOrder] = useState<OrderItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLatestOrder = async () => {
      try {
        setLoading(true);
        const response = await fetchLatestOrder();
        const latestOrder = response.data?.items?.[0] || null;
        setOrder(latestOrder);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to fetch order");
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    loadLatestOrder();
  }, []);

  return { order, loading, error };
};
