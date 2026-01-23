import type { ReviewRowType } from "../components/admin/Reviews/ReviewsRow";
import { usePaginatedQuery } from "../hooks/useFetchApiQuerry";

interface ReviewsFilters {
  search?: string;
  rating?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export function useReviews(filters: ReviewsFilters) {
  const params = new URLSearchParams({
    search: filters.search ?? "",
    rating: filters.rating ?? "",
    status: filters.status ?? "",
    page: String(filters.page ?? 1),
    limit: String(filters.limit ?? 10),
  });

  return usePaginatedQuery<ReviewRowType>(
    "reviews",
    `/reviews?${params.toString()}`,
    "reviews"
  );
}
