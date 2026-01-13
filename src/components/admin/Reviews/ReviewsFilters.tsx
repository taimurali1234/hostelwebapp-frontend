import { Search, X, Plus } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import AddReviewModal, {
  type CreateReviewForm,
} from "./AddReviewModel";
import { useCreateMutation } from "../../../hooks/useFetchApiQuerry";

export interface ReviewsFiltersProps {
  filters: {
    search: string;
    rating: string;
    status: string;
  };
  onChange: (
    key:  "search" | "rating" | "status",
    value: string
  ) => void;
  onClear: () => void;
}

export function ReviewsFilters({
  filters,
  onChange,
  onClear,
}: ReviewsFiltersProps) {
  const [open, setOpen] = useState(false);
const createReviewMutation = useCreateMutation<CreateReviewForm>(
  "reviews",
  "/api/reviews"
);

  

  const handleCreateReview = async (data: CreateReviewForm) => {

      await createReviewMutation.mutateAsync(data,{
        onSuccess: (res) => {
      toast.success(res.message || "User created successfully");
      setOpen(false);
    },
    onError: (err) => {
      toast.error(err.message);
    },
      });
    }
      
   

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg border">
            <Search size={18} className="text-gray-500" />
            <input
              placeholder="Search by user, room or comment..."
              value={filters.search}
              onChange={(e) => onChange("search", e.target.value)}
              className="bg-transparent outline-none text-sm w-64"
            />
          </div>

          {/* Rating */}
          <select
            value={filters.rating}
            onChange={(e) => onChange("rating", e.target.value)}
            className="bg-gray-100 px-4 py-2 rounded-lg border text-sm"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          {/* Status (UI only – backend later) */}
          <select
            value={filters.status}
            onChange={(e) => onChange("status", e.target.value)}
            className="bg-gray-100 px-4 py-2 rounded-lg border text-sm"
          >
            <option value="">All Status</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
          </select>

          {/* Clear */}
          <button
            onClick={onClear}
            className="flex items-center gap-2 px-4 py-2 text-sm 
            bg-white border rounded-lg hover:bg-gray-100"
          >
            <X size={16} />
            Clear Filters
          </button>
        </div>

        {/* Add Review */}
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm 
          bg-white border rounded-lg hover:bg-gray-100"
        >
          <Plus size={16} />
          Add Review
        </button>
      </div>

      {/* Add Review Modal */}
      <AddReviewModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreateReview}
      />
    </>
  );
}
