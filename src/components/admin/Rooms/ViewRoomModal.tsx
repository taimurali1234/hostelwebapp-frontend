import { X } from "lucide-react";
import type { RoomRowType } from "./RoomsRow";

interface ViewRoomModalProps {
  open: boolean;
  onClose: () => void;
  room: RoomRowType | null;
}

export default function ViewRoomModal({
  open,
  onClose,
  room,
}: ViewRoomModalProps) {
  if (!open || !room) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Room Details</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        {/* Fields (READ ONLY) */}
        <div className="space-y-3 text-sm">
          <Field label="Title" value={room.title} />
          <Field label="Beds" value={room.beds} />
          <Field label="Floor" value={room.floor} />
          <Field label="Status" value={room.status} />
          <Field label="Type" value={room.type} />
          {room.shortTermPrice && (
            <Field label="Short Term Price" value={`PKR ${room.shortTermPrice}`} />
          )}
          {room.longTermPrice && (
            <Field label="Long Term Price" value={`PKR ${room.longTermPrice}`} />
          )}
          {room.price && !room.shortTermPrice && !room.longTermPrice && (
            <Field label="Price" value={room.price} />
          )}
        </div>

        <div className="flex justify-end pt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
