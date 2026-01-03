import { X } from "lucide-react";
import { useState } from "react";
import type { CreateRoomForm, RoomType } from "../../../types/room.types";

interface AddRoomModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRoomForm) => void;
}

const initialState: CreateRoomForm = {
  title: "",
  type: "SINGLE",
  floor: "",
  beds: 1,
  washrooms: 1,
  description: "",
};

export default function AddRoomModal({
  open,
  onClose,
  onSubmit,
}: AddRoomModalProps) {
  const [form, setForm] = useState<CreateRoomForm>(initialState);

  if (!open) return null;

  const handleChange = (
    key: keyof CreateRoomForm,
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
          <h2 className="text-lg font-semibold">Add New Room</h2>
          <X
            className="cursor-pointer text-gray-500"
            onClick={onClose}
          />
        </div>

        {/* Title */}
        <input
          className="w-full border rounded-lg px-4 py-2"
          placeholder="Room title"
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

        {/* Floor */}
        <input
          className="w-full border rounded-lg px-4 py-2"
          placeholder="Floor (e.g. 2nd)"
          value={form.floor}
          onChange={(e) => handleChange("floor", e.target.value)}
        />

        {/* Beds & Washrooms */}
        <div className="flex gap-4">
          <input
            type="number"
            min={1}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Beds"
            value={form.beds}
            onChange={(e) =>
              handleChange("beds", Number(e.target.value))
            }
          />

          <input
            type="number"
            min={1}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Washrooms"
            value={form.washrooms}
            onChange={(e) =>
              handleChange("washrooms", Number(e.target.value))
            }
          />
        </div>

        {/* Description */}
        <textarea
          className="w-full border rounded-lg px-4 py-2"
          placeholder="Room description"
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
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
}
