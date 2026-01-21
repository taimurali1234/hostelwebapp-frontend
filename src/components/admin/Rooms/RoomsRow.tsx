import { Eye, Image, Pencil, Trash2, Video } from "lucide-react";

export interface RoomRowType {
  id: string;
  title: string;
  beds: string;
  floor: string;
  status: "Available" | "Booked";
  bookedSeats: number;
  type: string;
  price?: string;
  shortTermPrice?: number | string;
  longTermPrice?: number | string;
}

interface RoomRowProps {
  room: RoomRowType;
  onView: (room: RoomRowType) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void; 
  onMedia: (roomId: string, type: "image" | "video") => void; // ✅ NEW

}

export function RoomRow({ room, onView, onEdit, onDelete, onMedia }: RoomRowProps) {
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
      <td className="px-6 py-4 text-gray-600">
  {room.shortTermPrice || room.price
    ? `${room.shortTermPrice || room.price}`
    : "N/A"}
</td>

<td className="px-6 py-4 text-gray-600">
  {room.longTermPrice || room.price
    ? `${room.longTermPrice || room.price}`
    : "N/A"}
</td>


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
          <Image onClick={() => onMedia(room.id, "image")} className="cursor-pointer text-blue-500" />
        <Video onClick={() => onMedia(room.id, "video")} className="cursor-pointer text-purple-500" />
          <Trash2 onClick={() => onDelete(room.id)} size={18} className="cursor-pointer text-red-500" />
        </div>
      </td>
    </tr>
  );
}
