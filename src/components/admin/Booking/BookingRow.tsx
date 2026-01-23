import { Eye, Pencil, Trash2 } from "lucide-react";

export interface BookingRowType {
  id?: string;
  bookingId: string;
  user: string;
  room: string;
  seats: number;
  baseAmount: string;
  bookingType: "SHORT_TERM" | "LONG_TERM";
  status: "PENDING" | "RESERVED" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  bookingOrder?: {
    orderNumber: string;
  };
  orderNumber?: string;
  bookingOrderId?: string;
}

interface BookingRowProps {
  booking: BookingRowType;
  showOrderNumber?: boolean;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function BookingRow({
  booking,
  showOrderNumber = false,
  onView,
  onEdit,
  onDelete,
}: BookingRowProps) {
  console.log(booking);
  const bookingId = booking.id || booking.bookingId;
  const orderNumber = booking.orderNumber || booking.bookingOrder?.orderNumber || "N/A";
console.log("BookingRow orderNumber:", orderNumber);
  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-700",
    RESERVED: "bg-blue-100 text-blue-700",
    CONFIRMED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    COMPLETED: "bg-purple-100 text-purple-700",
  };

  return (
    <tr className="border-b last:border-none hover:bg-gray-50">
      {/* Order Number (conditional) */}
      {showOrderNumber && (
        <td className="px-6 py-4 text-gray-600 font-medium">
          {orderNumber}
        </td>
      )}

      {/* Booking ID / User */}
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-medium">{booking.bookingId}</span>
          <span className="text-sm text-gray-500">{booking.user}</span>
        </div>
      </td>

      {/* Room */}
      <td className="px-6 py-4 text-gray-600">
        {booking.room}
      </td>

      {/* Seats */}
      <td className="px-6 py-4 text-gray-600">
        {booking.seats}
      </td>

      {/* Booking Type */}
      <td className="px-6 py-4 text-gray-600">
        {booking.bookingType.replace("_", " ")}
      </td>

      {/* Status - Simple Badge */}
      <td className="px-6 py-4">
        <span
          className={`inline-block px-3 py-1 rounded text-sm font-medium ${
            statusColors[booking.status as keyof typeof statusColors]
          }`}
        >
          {booking.status}
        </span>

      </td>

      {/* Total Amount */}
      <td className="px-6 py-4 text-gray-600">
        {booking.baseAmount}
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex gap-4 text-gray-600">
          {onView && (
            <Eye
              className="cursor-pointer hover:text-black transition"
              size={18}
              onClick={() => onView(bookingId)}
            />
          )}
          {onEdit && (
            <Pencil
              className="cursor-pointer hover:text-black transition"
              size={18}
              onClick={() => onEdit(bookingId)}
            />
          )}
          {onDelete && (
            <Trash2
              className="cursor-pointer text-red-500 hover:text-red-700 transition"
              size={18}
              onClick={() => onDelete(bookingId)}
            />
          )}
        </div>
      </td>
    </tr>
  );
}
