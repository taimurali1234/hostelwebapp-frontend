import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSingleQuery } from "../../../hooks/useFetchApiQuerry";

type UpdateBookingFormState = {
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  seatsSelected: number;
  checkIn: string;
  checkOut?: string;
  bookingType: "SHORT_TERM" | "LONG_TERM";
};

interface UpdateBookingModalProps {
  open: boolean;
  onClose: () => void;
  bookingId: string | null;
  onUpdate: (data: UpdateBookingFormState) => void;
  loading?: boolean;
}

type SingleBookingApiResponse = {
  id: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  seatsSelected: number;
  checkIn: string;
  checkOut?: string;
  bookingType: "SHORT_TERM" | "LONG_TERM";
};

export default function UpdateBookingModal({
  open,
  onClose,
  bookingId,
  onUpdate,
  loading = false,
}: UpdateBookingModalProps) {
  const [form, setForm] = useState<UpdateBookingFormState | null>(null);
  const [errors, setErrors] = useState<string>("");

  /* =====================
     FETCH SINGLE BOOKING
  ====================== */

  const { data, isLoading } = useSingleQuery<SingleBookingApiResponse>(
    "booking",
    bookingId,
    "/api/bookings",
    open
  );

  useEffect(() => {
    if (open && data) {
      const checkInDate = data.checkIn
        ? new Date(data.checkIn).toISOString().split("T")[0]
        : "";
      const checkOutDate = data.checkOut
        ? new Date(data.checkOut).toISOString().split("T")[0]
        : "";

      setForm({
        status: data.status ?? "PENDING",
        seatsSelected: data.seatsSelected ?? 1,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        bookingType: data.bookingType ?? "SHORT_TERM",
      });
      setErrors("");
    }
  }, [open, data]);

  if (!open) return null;
  if (isLoading || !form) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-md rounded-xl p-6">
          <p className="text-center text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  /* =====================
     HANDLERS
  ====================== */

  const handleChange = (
    key: keyof UpdateBookingFormState,
    value: string | number
  ) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    setErrors("");
  };

  const handleSubmit = () => {
    if (!form) return;

    // Validation
    if (!form.status) {
      setErrors("Status is required");
      return;
    }

    if (!form.seatsSelected || form.seatsSelected < 1) {
      setErrors("Seats must be at least 1");
      return;
    }

    if (!form.checkIn) {
      setErrors("Check-in date is required");
      return;
    }

    if (
      form.bookingType === "SHORT_TERM" &&
      !form.checkOut
    ) {
      setErrors("Check-out date is required for short-term bookings");
      return;
    }

    onUpdate(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Update Booking</h2>
          <X
            className="cursor-pointer text-gray-500"
            onClick={onClose}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            className="w-full border rounded-lg px-4 py-2 outline-none focus:border-blue-500"
            value={form.status}
            onChange={(e) =>
              handleChange("status", e.target.value)
            }
          >
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Booking Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Booking Type
          </label>
          <select
            className="w-full border rounded-lg px-4 py-2 outline-none focus:border-blue-500"
            value={form.bookingType}
            onChange={(e) =>
              handleChange("bookingType", e.target.value)
            }
          >
            <option value="SHORT_TERM">Short Term</option>
            <option value="LONG_TERM">Long Term</option>
          </select>
        </div>

        {/* Seats */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seats Selected
          </label>
          <input
            type="number"
            min={1}
            className="w-full border rounded-lg px-4 py-2 outline-none focus:border-blue-500"
            placeholder="Number of seats"
            value={form.seatsSelected}
            onChange={(e) =>
              handleChange("seatsSelected", Number(e.target.value))
            }
          />
        </div>

        {/* Check-in */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-in Date
          </label>
          <input
            type="date"
            className="w-full border rounded-lg px-4 py-2 outline-none focus:border-blue-500"
            value={form.checkIn}
            onChange={(e) =>
              handleChange("checkIn", e.target.value)
            }
          />
        </div>

        {/* Check-out (only for SHORT_TERM) */}
        {form.bookingType === "SHORT_TERM" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-out Date
            </label>
            <input
              type="date"
              className="w-full border rounded-lg px-4 py-2 outline-none focus:border-blue-500"
              value={form.checkOut || ""}
              onChange={(e) =>
                handleChange("checkOut", e.target.value)
              }
            />
          </div>
        )}

        {/* Error Message */}
        {errors && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {errors}
          </div>
        )}

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
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
