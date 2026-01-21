import { X } from "lucide-react";
import { useState } from "react";
import type { CreateRoomPricingForm, RoomType, StayType } from "../../../types/roomPricing.types";

interface AddRoomPricingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRoomPricingForm) => void;
}

const initialState: CreateRoomPricingForm = {
  roomType: "SINGLE",
  stayType: "SHORT_TERM",
  price: 0,
  isActive: true,
};

const roomTypes: RoomType[] = [
  "SINGLE",
  "DOUBLE_SHARING",
  "TRIPLE_SHARING",
  "QUAD_SHARING",
  "QUINT_SHARING",
  "VIP_SUIT",
];

const stayTypes: StayType[] = ["SHORT_TERM", "LONG_TERM"];

export default function AddRoomPricingModal({
  open,
  onClose,
  onSubmit,
}: AddRoomPricingModalProps) {
  const [form, setForm] = useState<CreateRoomPricingForm>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open) return null;

  const handleChange = (
    key: keyof CreateRoomPricingForm,
    value: string | number | boolean
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.roomType) {
      newErrors.roomType = "Room type is required";
    }
    if (!form.stayType) {
      newErrors.stayType = "Stay type is required";
    }
    if (!form.price || form.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(form);
      onClose();
      setForm(initialState);
      setErrors({});
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Add New Room Pricing</h2>
          <X
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={onClose}
          />
        </div>

        {/* Room Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Room Type *</label>
          <select
            className={`w-full border rounded-lg px-4 py-2 ${
              errors.roomType ? "border-red-500" : ""
            }`}
            value={form.roomType}
            onChange={(e) => handleChange("roomType", e.target.value)}
          >
            {roomTypes.map((type) => (
              <option key={type} value={type}>
                {type.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          {errors.roomType && (
            <p className="text-red-500 text-sm mt-1">{errors.roomType}</p>
          )}
        </div>

        {/* Stay Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Stay Type *</label>
          <select
            className={`w-full border rounded-lg px-4 py-2 ${
              errors.stayType ? "border-red-500" : ""
            }`}
            value={form.stayType}
            onChange={(e) => handleChange("stayType", e.target.value as StayType)}
          >
            {stayTypes.map((type) => (
              <option key={type} value={type}>
                {type.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          {errors.stayType && (
            <p className="text-red-500 text-sm mt-1">{errors.stayType}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-2">Price (PKR) *</label>
          <input
            type="number"
            min={0}
            step="1"
            className={`w-full border rounded-lg px-4 py-2 ${
              errors.price ? "border-red-500" : ""
            }`}
            placeholder="Enter price"
            value={form.price || ""}
            onChange={(e) => handleChange("price", e.target.value === "" ? 0 : Number(e.target.value))}
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
          )}
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Active Status</label>
          <input
            type="checkbox"
            checked={form.isActive ?? true}
            onChange={(e) => handleChange("isActive", e.target.checked)}
            className="w-4 h-4 cursor-pointer"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Pricing
          </button>
        </div>
      </div>
    </div>
  );
}
