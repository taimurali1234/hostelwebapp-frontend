import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { EditRoomPricingForm, RoomType, StayType } from "../../../types/roomPricing.types";
import { useSingleQuery } from "../../../hooks/useFetchApiQuerry";

interface EditRoomPricingModalProps {
  open: boolean;
  onClose: () => void;
  pricingId: string | null;     // ✅ Only ID now
  onSubmit: (data: EditRoomPricingForm) => void;
}

interface SinglePricingApiResponse {
    seatPricing?: {
      id: string;
      roomType: RoomType;
      stayType: StayType;
      price: number;
      isActive: boolean;
    };
    id?: string;
    roomType?: RoomType;
    stayType?: StayType;
    price?: number;
    isActive?: boolean;
}

const roomTypes: RoomType[] = [
  "SINGLE",
  "DOUBLE_SHARING",
  "TRIPLE_SHARING",
  "QUAD_SHARING",
  "QUINT_SHARING",
  "VIP_SUIT",
];

const stayTypes: StayType[] = ["SHORT_TERM", "LONG_TERM"];

export default function EditRoomPricingModal({
  open,
  onClose,
  pricingId,
  onSubmit,
}: EditRoomPricingModalProps) {
  const [form, setForm] = useState<EditRoomPricingForm | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ Fetch single pricing like EditRoomModal
  const { data, isLoading } = useSingleQuery<SinglePricingApiResponse>(
    "roomPricing",
    pricingId,
    "/seat-pricing",
    open
  );
  console.log("EditRoomPricingModal - pricingId:", pricingId);
  console.log("EditRoomPricingModal - Fetched pricing data:", data);

  useEffect(() => {
    if (open && data) {
      // Handle nested response structure
      const pricingData = (data as any).seatPricing || data;
      console.log("Setting form with pricing data:", pricingData);
      
      setForm({
        id: pricingData.id,
        roomType: pricingData.roomType,
        stayType: pricingData.stayType,
        price: pricingData.price,
        isActive: pricingData.isActive,
      });
      setErrors({});
    }
  }, [open, data]);

  if (!open) return null;
  if (isLoading || !form) return null;

  const handleChange = (
    key: keyof EditRoomPricingForm,
    value: string | number | boolean
  ) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (form.price !== undefined && form.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!form) return;

    if (validateForm()) {
      onSubmit(form);   // ✅ form already contains ID
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Edit Room Pricing</h2>
          <X
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={onClose}
          />
        </div>

        {/* Room Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Room Type</label>
          <select
            className="w-full border rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
            value={form.roomType}
            disabled
          >
            {roomTypes.map((type) => (
              <option key={type} value={type}>
                {type.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Stay Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Stay Type</label>
          <select
            className="w-full border rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
            value={form.stayType}
            disabled
          >
            {stayTypes.map((type) => (
              <option key={type} value={type}>
                {type.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-2">Price (PKR)</label>
          <input
            type="number"
            className={`w-full border rounded-lg px-4 py-2 ${
              errors.price ? "border-red-500" : ""
            }`}
            value={form.price}
            onChange={(e) =>
              handleChange("price", Number(e.target.value))
            }
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
          )}
        </div>

        {/* Active */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Active Status</label>
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              handleChange("isActive", e.target.checked)
            }
            className="w-4 h-4 cursor-pointer"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Update Pricing
          </button>
        </div>
      </div>
    </div>
  );
}
