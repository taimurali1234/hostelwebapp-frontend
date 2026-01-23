import { useState, useEffect } from "react";
import { X, Loader } from "lucide-react";
import type { OrderRowType } from "@/hooks/useOrdersFetch";

interface OrderEditModalProps {
  order: OrderRowType;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: any) => void;
  isLoading: boolean;
}

export default function OrderEditModal({
  order,
  isOpen,
  onClose,
  onUpdate,
  isLoading,
}: OrderEditModalProps) {
  const [status, setStatus] = useState<"PENDING" | "RESERVED" | "CONFIRMED" | "CANCELLED" | "COMPLETED">(order.status);

  useEffect(() => {
    setStatus(order.status);
  }, [order.status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ status });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Order</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Order Info */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Order Number
            </label>
            <input
              type="text"
              value={order.orderNumber}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Customer
            </label>
            <input
              type="text"
              value={order.user?.name || "N/A"}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Total Amount
            </label>
            <input
              type="text"
              value={`PKR ${order.totalAmount.toLocaleString()}`}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Number of Bookings
            </label>
            <input
              type="text"
              value={order.bookings?.length || 0}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "PENDING" | "RESERVED" | "CONFIRMED" | "CANCELLED" | "COMPLETED")}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            >
              <option value="PENDING">Pending</option>
              <option value="RESERVED">Reserved</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Order"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
