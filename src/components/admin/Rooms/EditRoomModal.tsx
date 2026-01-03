import { X } from "lucide-react";
import {  useEffect, useState } from "react";
import type { CreateRoomForm, EditRoomForm, RoomType } from "../../../types/room.types";
import { useSingleQuery } from "../../../hooks/useFetchApiQuerry";

interface EditRoomModalProps {
  open: boolean;
  onClose: () => void;
  roomId: string | null; // ✅ FIXED
  onUpdate: (data: EditRoomForm) => void;
}
interface SingleRoomApiResponse {
  room: EditRoomForm;
  prices: Record<string, number>;
}


export default function EditRoomModal({
  open,
  onClose,
  roomId,
  onUpdate,
}: EditRoomModalProps) {
  const [form, setForm] = useState<EditRoomForm | null>(null);

  // ✅ fetch single room by ID
  const { data, isLoading } = useSingleQuery<SingleRoomApiResponse>(
    "room",
    roomId,
    "/api/rooms",
    open
  );
  console.log(data)
  useEffect(() => {
  if (open && data?.room) {
    setForm({
      title: data.room.title,
      type: data.room.type,
      floor: data.room.floor,
      beds: data.room.beds,
      washrooms: data.room.washrooms,
      description: data.room.description ?? "",
      status: data.room.status,
      stayType: data.room.stayType,
      price: data.room.price,
    });
  }
}, [open, data]);
  console.log(form)
  


  if (!open) return null;
  if (isLoading || !form) return null;

  const handleChange = (
    key: keyof CreateRoomForm,
    value: string | number
  ) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSubmit = () => {
    if (!form) return;
    onUpdate(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Edit Room</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        {/* Title */}
        <input
          className="w-full border rounded-lg px-4 py-2"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />

        {/* Type */}
        <select
          className="w-full border rounded-lg px-4 py-2"
          value={form.type}
          onChange={(e) =>
            handleChange("type", e.target.value as RoomType)
          }
        >
          <option value="SINGLE">Single</option>
          <option value="DOUBLE_SHARING">Double Sharing</option>
          <option value="TRIPLE_SHARING">Triple Sharing</option>
          <option value="QUAD_SHARING">Quad Sharing</option>
          <option value="QUINT_SHARING">Quint Sharing</option>
          <option value="VIP_SUIT">VIP Suit</option>
        </select>

        {/* Status */}
        <select
          className="w-full border rounded-lg px-4 py-2"
          value={form.status}
          onChange={(e) =>
            handleChange("status", e.target.value)
          }
        >
          <option value="AVAILABLE">Available</option>
          <option value="BOOKED">Booked</option>
        </select>

        {/* Floor */}
        <input
          className="w-full border rounded-lg px-4 py-2"
          value={form.floor}
          onChange={(e) => handleChange("floor", e.target.value)}
        />

        {/* Beds & Washrooms */}
        <div className="flex gap-4">
          <input
            type="number"
            min={1}
            className="w-full border rounded-lg px-4 py-2"
            value={form.beds}
            onChange={(e) =>
              handleChange("beds", Number(e.target.value))
            }
          />

          <input
            type="number"
            min={1}
            className="w-full border rounded-lg px-4 py-2"
            value={form.washrooms}
            onChange={(e) =>
              handleChange("washrooms", Number(e.target.value))
            }
          />
        </div>

        {/* Description */}
        <textarea
          className="w-full border rounded-lg px-4 py-2"
          rows={3}
          value={form.description}
          onChange={(e) =>
            handleChange("description", e.target.value)
          }
        />

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
            Update Room
          </button>
        </div>
      </div>
    </div>
  );
}
