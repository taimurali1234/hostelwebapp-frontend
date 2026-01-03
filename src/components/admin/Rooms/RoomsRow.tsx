import { Eye, Pencil, Trash2 } from "lucide-react";

export interface RoomRowType {
  id: string;
  title: string;
  beds: string;
  floor: string;
  status: "Available" | "Booked";
  bookedSeats:number;
  type: string;
  price: string;
}

interface RoomRowProps {
  room: RoomRowType;
  onView: (room: RoomRowType) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void; // ✅ NEW

}

export function RoomRow({ room, onView, onEdit,onDelete }: RoomRowProps) {
  return (
    <tr className="border-b border-gray-300 last:border-none">
      <td className="px-6 py-4">{room.title}</td>
      <td className="px-6 py-4 text-gray-600">{room.beds}</td>
      <td className="px-6 py-4 text-gray-600">{room.floor}</td>

      <td className="px-6 py-4">
        <span
          className={`text-sm font-medium ${
            room.status.toLowerCase() === "available"
              ? "text-green-500"
              : "text-gray-500"
          }`}
        >
          {room.status}
        </span>
      </td>

      <td className="px-6 py-4 text-gray-600">{room.bookedSeats}</td>
      <td className="px-6 py-4 text-gray-600">{room.type}</td>
      <td className="px-6 py-4 text-gray-600">{room.price}</td>

      <td className="px-6 py-4">
        <div className="flex gap-4 text-gray-600">
          <Eye
            size={18}
            className="cursor-pointer hover:text-black"
            onClick={() => onView(room)}
          />
          <Pencil
            size={18}
            className="cursor-pointer hover:text-black"
            onClick={() => onEdit(room.id)}
          />
          <Trash2 onClick={() => onDelete(room.id)} size={18} className="cursor-pointer text-red-500" />
        </div>
      </td>
    </tr>
  );
}
