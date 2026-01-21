import { X, AlertCircle } from "lucide-react";

interface DeleteRoomPricingModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function DeleteRoomPricingModal({
  open,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteRoomPricingModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Delete Pricing</h2>
          <X
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={onClose}
          />
        </div>

        {/* Alert Icon and Message */}
        <div className="flex gap-3 bg-red-50 p-4 rounded-lg">
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <div>
            <p className="text-sm font-medium text-red-600">Confirm Deletion</p>
            <p className="text-sm text-red-500 mt-1">
              Are you sure you want to delete this room pricing? This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end pt-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
