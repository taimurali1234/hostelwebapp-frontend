import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSingleQuery } from "../../../hooks/useFetchApiQuerry";
import {
  updateReviewSchema,
} from "../../../Zod Validation/reviews/reviews.dtos";

type EditReviewFormState = {
  rating: number;
  comment: string;
  status: "APPROVED" | "PENDING";
};


interface EditReviewModalProps {
  open: boolean;
  onClose: () => void;
  reviewId: string | null;
  onUpdate: (data: EditReviewFormState) => void;
}

type SingleReviewApiResponse = {
  review: {
    rating: number;
    comment?: string | null;
    status: "APPROVED" | "PENDING";
  };
};


export default function EditReviewModal({
  open,
  onClose,
  reviewId,
  onUpdate,
}: EditReviewModalProps) {
  const [form, setForm] = useState<EditReviewFormState | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof EditReviewFormState, string[]>>
  >({});

  /* =====================
     FETCH SINGLE REVIEW
  ====================== */

  const { data, isLoading } = useSingleQuery<SingleReviewApiResponse>(
    "review",
    reviewId,
    "/reviews",
    open
  );
  console.log(data)

  useEffect(() => {
    if (open && data) {
      setForm({
        rating: data.review.rating ?? 5,
        comment: data.review.comment ?? "",
        status: data.review.status ?? "PENDING",
      });
    }
  }, [open, data]);

  if (!open) return null;
  if (isLoading || !form) return null;

  /* =====================
     HANDLERS
  ====================== */

  const handleChange = (
    key: keyof EditReviewFormState,
    value: string | number
  ) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

    // clear field error
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleSubmit = () => {
    if (!form) return;

    const result = updateReviewSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);

      toast.error(
        result.error.issues[0]?.message || "Validation error"
      );
      return;
    }

    setErrors({});
    onUpdate(form);
  };

  /* =====================
     UI
  ====================== */

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Edit Review</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        {/* Status */}
        <select
          className={`w-full border rounded-lg px-4 py-2 ${
            errors.status ? "border-red-500" : ""
          }`}
          value={form.status}
          onChange={(e) =>
            handleChange(
              "status",
              e.target.value
            )
          }
        >
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
        </select>

        {errors.status && (
          <p className="text-red-500 text-xs">
            {errors.status[0]}
          </p>
        )}

        {/* Rating */}
        <select
          className={`w-full border rounded-lg px-4 py-2 ${
            errors.rating ? "border-red-500" : ""
          }`}
          value={form.rating}
          onChange={(e) =>
            handleChange("rating", Number(e.target.value))
          }
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r} Star{r > 1 ? "s" : ""}
            </option>
          ))}
        </select>

        {errors.rating && (
          <p className="text-red-500 text-xs">
            {errors.rating[0]}
          </p>
        )}

        {/* Comment */}
        <textarea
          className={`w-full border rounded-lg px-4 py-2 ${
            errors.comment ? "border-red-500" : ""
          }`}
          rows={3}
          placeholder="Comment (optional)"
          value={form.comment}
          onChange={(e) =>
            handleChange("comment", e.target.value)
          }
        />

        {errors.comment && (
          <p className="text-red-500 text-xs">
            {errors.comment[0]}
          </p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Update Review
          </button>
        </div>
      </div>
    </div>
  );
}
