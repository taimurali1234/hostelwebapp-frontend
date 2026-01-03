import { X, AlertTriangle } from "lucide-react";

interface DeleteBookingModalProps {
  open: boolean;
  bookingId: string | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteBookingModal({
  open,
  bookingId,
  loading = false,
  onClose,
  onConfirm,
}: DeleteBookingModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-5">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle size={22} />
            <h2 className="text-lg font-semibold">Delete Booking</h2>
          </div>
          <X className="cursor-pointer text-gray-500" onClick={onClose} />
        </div>

        {/* Content */}
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this booking? This action will:
          </p>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>Release the booked seats back to the room</li>
            <li>Remove all booking records</li>
            <li>Cannot be undone</li>
          </ul>
          <p className="text-xs text-gray-500 mt-2">
            Booking ID: <span className="font-mono text-gray-700">{bookingId}</span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
