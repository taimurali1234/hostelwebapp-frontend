import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import apiClient from "../services/apiClient";

/* =======================
   PAGINATED LIST QUERY
======================= */

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

/* =======================
   CREATE MUTATION (GENERIC)
======================= */

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

export function useCreateMutation<TPayload, TResponse = any>(
  listKey: string,      // e.g. "users", "reviews"
  endpoint: string      // e.g. "/api/users"
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<TResponse>, Error, TPayload>({
    mutationFn: async (payload) => {
      try {
        const res = await apiClient.post(endpoint, payload);

        // Backend standard response
        return res.data;
      } catch (err: any) {
        /**
         * Axios error normalization
         */
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong";

        throw new Error(message);
      }
    },

    onSuccess: (response) => {
      /**
       * Optional success validation
       */
      if (response?.success === false) {
        throw new Error(response.message || "Creation failed");
      }

      // 🔄 Refresh list
      queryClient.invalidateQueries({ queryKey: [listKey] });
    },
  });
}

export function usePaginatedQuery<T>(
  key: string,
  queryString: string,
  itemsKey: string
) {
  return useQuery<PaginatedResponse<T>>({
    queryKey: [key, queryString],

    queryFn: async () => {
      const res = await apiClient.get(queryString);

      const responseData = res.data.data ?? res.data;

      return {
        items: responseData[itemsKey] ?? [],
        total: responseData.total ?? 0,
        page: responseData.page ?? 1,
        limit: responseData.limit ?? 10,
      };
    },

    placeholderData: (prev) => prev,
  });
}

/* =======================
   SINGLE ITEM QUERY
======================= */

export function useSingleQuery<T>(
  key: string,
  id: string | null,
  endpoint: string,
  enabled = true
) {
  return useQuery<T>({
    queryKey: [key, id],
    enabled: !!id && enabled,

    queryFn: async () => {
      const res = await apiClient.get(`${endpoint}/${id}`);
      return res.data.data ?? res.data;
    },
  });
}

/* =======================
   UPDATE MUTATION
======================= */

export function useUpdateMutation<T>(
  listKey: string,
  endpoint: string,
  id: string | null
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: T & { id?: string }) => {
      const updateId = data.id || id;

      if (!updateId) {
        throw new Error("Invalid ID");
      }

      const res = await apiClient.patch(
        `${endpoint}/${updateId}`,
        data
      );

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [listKey] });

      if (id) {
        queryClient.invalidateQueries({ queryKey: [listKey, id] });
      }
    },
  });
}

/* =======================
   DELETE MUTATION
======================= */

export function useDeleteMutation(
  listKey: string,
  endpoint: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`${endpoint}/${id}`);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [listKey] });
    },
  });
}
