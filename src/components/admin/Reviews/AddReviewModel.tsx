import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createReviewSchema } from "../../../Zod Validation/reviews/reviews.dtos";

export interface CreateReviewForm {
  userId: string;
  roomId: string;
  rating: number;
  comment: string;
}

interface AddReviewModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateReviewForm) => Promise<void>;
}

const initialState: CreateReviewForm = {
  userId: "",
  roomId: "",
  rating: 5,
  comment: "",
};

export default function AddReviewModal({
  open,
  onClose,
  onSubmit,
}: AddReviewModalProps) {
  const [form, setForm] = useState<CreateReviewForm>(initialState);

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateReviewForm, string[]>>
  >({});

  useEffect(() => {
    if (!open) {
      setForm(initialState);
      setErrors({});
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (
    key: keyof CreateReviewForm,
    value: string | number
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  /* =====================
     SUBMIT HANDLER
  ====================== */

  const handleSubmit = () => {
    if (!form) return;
  
    const result = createReviewSchema.safeParse(form);
  
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
  
      // 🔥 Toast: show first error only
      const firstError =
        result.error.issues[0]?.message || "Validation error";
  
      toast.error(firstError);
  
      return;
    }
  
    setErrors({}); // ✅ clear errors
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Add Review</h2>
          <X className="cursor-pointer text-gray-500" onClick={onClose} />
        </div>

        {/* User ID */}
        <input
          className={`w-full border rounded-lg px-4 py-2 ${
            errors.userId ? "border-red-500" : ""
          }`}
          placeholder="User ID"
          value={form.userId}
          onChange={(e) => handleChange("userId", e.target.value)}
        />
        {errors.userId && (
          <p className="text-red-500 text-xs">{errors.userId[0]}</p>
        )}

        {/* Room ID */}
        <input
          className={`w-full border rounded-lg px-4 py-2 ${
            errors.roomId ? "border-red-500" : ""
          }`}
          placeholder="Room ID"
          value={form.roomId}
          onChange={(e) => handleChange("roomId", e.target.value)}
        />
        {errors.roomId && (
          <p className="text-red-500 text-xs">{errors.roomId[0]}</p>
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
          <p className="text-red-500 text-xs">{errors.rating[0]}</p>
        )}

        {/* Comment */}
        <textarea
          className={`w-full border rounded-lg px-4 py-2 ${
            errors.comment ? "border-red-500" : ""
          }`}
          rows={3}
          placeholder="Comment (optional)"
          value={form.comment}
          onChange={(e) => handleChange("comment", e.target.value)}
        />
        {errors.comment && (
          <p className="text-red-500 text-xs">{errors.comment[0]}</p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Add Review
          </button>
        </div>
      </div>
    </div>
  );
}
