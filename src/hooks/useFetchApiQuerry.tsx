import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

/* =======================
   PAGINATED LIST QUERY
======================= */

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export function usePaginatedQuery<T>(
  key: string,
  queryString: string,
  itemsKey: string
) {
  return useQuery<PaginatedResponse<T>>({
    queryKey: [key, queryString],

    queryFn: async ({ signal }) => {
      const res = await fetch(
        `${API_BASE_URL}${queryString}`,
        { signal }
      );

      if (!res.ok) throw new Error("Fetch failed");

      const json = await res.json();

      return {
        items: json[itemsKey] ?? [],
        total: json.total ?? 0,
        page: json.page ?? 1,
        limit: json.limit ?? 10,
      };
    },

    // React Query v5 replacement for keepPreviousData
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

    queryFn: async ({ signal }) => {
      const res = await fetch(
        `${API_BASE_URL}${endpoint}/${id}`,
        { signal }
      );

      if (!res.ok) throw new Error("Fetch failed");
      return res.json();
    },
  });
}

/* =======================
   UPDATE MUTATION
======================= */

export function useUpdateMutation<T>(
  listKey: string,   // e.g. "rooms"
  endpoint: string,  // e.g. "/api/rooms"
  id: string | null
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: T) => {
      if (!id) throw new Error("Invalid ID");

      const res = await fetch(
        `${API_BASE_URL}${endpoint}/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
        const result = await res.json();


      if (!res.ok) throw new Error(result.message || "Update failed");
      return result;
    },

    onSuccess: () => {
      // ✅ refresh list
      queryClient.invalidateQueries({ queryKey: [listKey] });

      // ✅ refresh single item
      queryClient.invalidateQueries({ queryKey: [listKey, id] });
    },
  });
}


/* =======================
   DELETE MUTATION
======================= */

export function useDeleteMutation(
  listKey: string,   // e.g. "rooms"
  endpoint: string   // e.g. "/api/rooms"
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${API_BASE_URL}${endpoint}/${id}`,
        {
          method: "DELETE",
        }
      );
      const result = await res.json()

      if (!res.ok) throw new Error(result.message || "Delete failed");
      return result;
    },

    onSuccess: () => {
      // 🔄 refresh rooms list
      queryClient.invalidateQueries({ queryKey: [listKey] });
    },
  });
}
