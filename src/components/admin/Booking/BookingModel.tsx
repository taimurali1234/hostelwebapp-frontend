import { X } from "lucide-react";
import { useState } from "react";
import type { CreateBookingForm } from "../../../types/booking.types";

interface AddBookingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBookingForm) => void;
}

const initialState: CreateBookingForm = {
  userId: "",
  roomId: "",
  bookingType: "SHORT_TERM",
  seatsSelected: 1,
  checkIn: "",
  checkOut: "",
  baseAmount: 0,
  taxAmount: 0,
  discount: 0,
  status: "PENDING",
  source: "ADMIN",
};

export default function AddBookingModal({
  open,
  onClose,
  onSubmit,
}: AddBookingModalProps) {
  const [form, setForm] = useState<CreateBookingForm>(initialState);

  if (!open) return null;

  const handleChange = (
    key: keyof CreateBookingForm,
    value: string | number
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmit(form);
    onClose();
    setForm(initialState);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Create Booking</h2>
          <X
            className="cursor-pointer text-gray-500"
            onClick={onClose}
          />
        </div>

        {/* User ID */}
        <input
          className="w-full border rounded-lg px-4 py-2"
          placeholder="User ID"
          value={form.userId}
          onChange={(e) => handleChange("userId", e.target.value)}
        />

        {/* Room ID */}
        <input
          className="w-full border rounded-lg px-4 py-2"
          placeholder="Room ID"
          value={form.roomId}
          onChange={(e) => handleChange("roomId", e.target.value)}
        />

        {/* Booking Type */}
        <select
          className="w-full border rounded-lg px-4 py-2"
          value={form.bookingType}
          onChange={(e) =>
            handleChange("bookingType", e.target.value)
          }
        >
          <option value="SHORT_TERM">Short Term</option>
          <option value="LONG_TERM">Long Term</option>
        </select>

        {/* Seats */}
        <input
          type="number"
          min={1}
          className="w-full border rounded-lg px-4 py-2"
          placeholder="Seats Selected"
          value={form.seatsSelected}
          onChange={(e) =>
            handleChange("seatsSelected", Number(e.target.value))
          }
        />

        {/* Dates */}
        <div className="flex gap-4">
          <input
            type="date"
            className="w-full border rounded-lg px-4 py-2"
            value={form.checkIn}
            onChange={(e) =>
              handleChange("checkIn", e.target.value)
            }
          />

          <input
            type="date"
            className="w-full border rounded-lg px-4 py-2"
            value={form.checkOut}
            onChange={(e) =>
              handleChange("checkOut", e.target.value)
            }
          />
        </div>

        {/* Amounts */}
        <div className="flex gap-4">
          <input
            type="number"
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Base Amount"
            value={form.baseAmount}
            onChange={(e) =>
              handleChange("baseAmount", Number(e.target.value))
            }
          />

          <input
            type="number"
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Tax"
            value={form.taxAmount}
            onChange={(e) =>
              handleChange("taxAmount", Number(e.target.value))
            }
          />
        </div>

        {/* Discount */}
        <input
          type="number"
          className="w-full border rounded-lg px-4 py-2"
          placeholder="Discount"
          value={form.discount}
          onChange={(e) =>
            handleChange("discount", Number(e.target.value))
          }
        />

        {/* Status */}
        <select
          className="w-full border rounded-lg px-4 py-2"
          value={form.status}
          onChange={(e) =>
            handleChange("status", e.target.value)
          }
        >
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

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
            Create Booking
          </button>
        </div>
      </div>
    </div>
  );
}
