import { useMemo, useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import ReviewsHeader from "../../components/admin/Reviews/ReviewsHeader";
import { ReviewsFilters } from "../../components/admin/Reviews/ReviewsFilters";
import {
  ReviewsRow,
  type ReviewRowType,
} from "../../components/admin/Reviews/ReviewsRow";
import { TableHeader } from "../../components/common/TableHeader";
import { TableCellLoader } from "../../components/common/Loader";
import { useDebounce } from "../../hooks/useDebounce";
import { useDeleteMutation, useUpdateMutation } from "../../hooks/useFetchApiQuerry";
import { useReviews } from "../../hooks/useReviewsFetch";
import EditReviewModal from "../../components/admin/Reviews/EditReviewModel";
import { toast } from "react-toastify";
import DeleteConfirmModal from "../../components/admin/Rooms/DeleteRoomModel";

export interface EditReviewForm {
  rating?: number;
  comment?: string;
  status?: "APPROVED" | "PENDING";
}

interface ReviewsFiltersState {
  search: string;
  rating: string;
  status: string;
}

const columns = [
  "User",
  "Room",
  "Rating",
  "Comment",
  "status",
  "Date",
  "Actions",
];

export default function Reviews() {
  const [filters, setFilters] = useState<ReviewsFiltersState>({
    search: "",
    rating: "",
    status: "",
  });

  const [page, setPage] = useState(1);
  const limit = 10;

  const [editOpen, setEditOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);

  const debouncedFilters = useDebounce(filters, 500);

  const queryFilters = useMemo(
    () => ({
      search: debouncedFilters.search,
      rating: debouncedFilters.rating,
      status: debouncedFilters.status,
      page,
      limit,
    }),
    [debouncedFilters, page]
  );

  const { data, isLoading } = useReviews(queryFilters);

  const reviews = data?.items ?? [];
  const total = data?.total ?? 0;

  /* =========================
     UPDATE REVIEW
  ========================== */

  const updateReviewMutation = useUpdateMutation<EditReviewForm>(
    "reviews",
    "/api/reviews",
    selectedReviewId
  );

  const handleUpdateReview = (data: EditReviewForm) => {
    updateReviewMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Review updated successfully ⭐");
        setEditOpen(false);
        setSelectedReviewId(null);
      },
      onError: (error: unknown) => {
        let message = "Failed to update review";
        if (error instanceof Error) message = error.message;
        toast.error(message);
      },
    });
  };

  const deleteReviewMutation = useDeleteMutation(
    "reviews",
    "/api/reviews"
  );

  const handleDelete = (id: string) => {
    setDeleteReviewId(id);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteReviewId) return;

    deleteReviewMutation.mutate(deleteReviewId, {
      onSuccess: () => {
        toast.success("Review deleted successfully 🗑️");
        setDeleteOpen(false);
        setDeleteReviewId(null);
      },
      onError: (error: unknown) => {
        let message = "Failed to delete review";
        if (error instanceof Error) message = error.message;
        toast.error(message);
      },
    });
  };

  const handleEdit = (id: string) => {
    setSelectedReviewId(id);
    setEditOpen(true);
  };

  return (
    <AdminLayout>
      <div className="bg-surface">
        <ReviewsHeader />

        <h2 className="text-lg font-semibold mb-2">
          Showing {total} reviews
        </h2>

        <ReviewsFilters
          filters={filters}
          onChange={(key, value) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
            setPage(1);
          }}
          onClear={() => {
            setFilters({ search: "", rating: "", status: "" });
            setPage(1);
          }}
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <TableHeader columns={columns} />

            <tbody>
              {isLoading ? (
                <TableCellLoader colSpan={7} text="Loading reviews..." />
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No reviews found
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <ReviewsRow
                    key={review.id}
                    review={review}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-600">
            Page {page} of {Math.ceil(total / limit)}
          </span>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <button
              disabled={page * limit >= total}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* EDIT REVIEW MODAL */}
      <EditReviewModal
        open={editOpen}
        reviewId={selectedReviewId}
        onClose={() => {
          setEditOpen(false);
          setSelectedReviewId(null);
        }}
        onUpdate={handleUpdateReview}
      />

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteConfirmModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteReviewId(null);
        }}
        onConfirm={handleConfirmDelete}
        loading={deleteReviewMutation.isPending}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
      />
    </AdminLayout>
  );
}
