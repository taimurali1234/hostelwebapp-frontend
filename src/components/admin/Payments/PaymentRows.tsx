import { Eye, Trash2 } from "lucide-react";

export interface PaymentRowType {
  bookingId: string;
  transactionId: string;
  paymentMethod: "CASH" | "CARD" | "ONLINE" | "BANK_TRANSFER";
  paymentStatus: "PAID" | "PENDING" | "FAILED" | "REFUNDED";
  date: string;
}

export function PaymentRow({
  payment,
}: {
  payment: PaymentRowType;
}) {
  return (
    <tr className="border-b last:border-none">
      {/* Booking ID */}
      <td className="px-6 py-4">
        {payment.bookingId}
      </td>

      {/* Transaction ID */}
      <td className="px-6 py-4 text-gray-600 max-w-sm truncate">
        {payment.transactionId}
      </td>

      {/* Payment Method */}
      <td className="px-6 py-4 text-gray-600">
        {payment.paymentMethod}
      </td>

      {/* Payment Status */}
      <td className="px-6 py-4">
        <span
          className={`text-sm font-medium ${
            payment.paymentStatus === "FAILED"
              ? "text-red-500"
              : payment.paymentStatus === "PENDING"
              ? "text-yellow-500"
              : payment.paymentStatus === "REFUNDED"
              ? "text-blue-500"
              : "text-green-500"
          }`}
        >
          {payment.paymentStatus}
        </span>
      </td>

      {/* Date */}
      <td className="px-6 py-4 text-gray-600">
        {payment.date}
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex gap-4 text-gray-600">
          <Eye
            className="cursor-pointer hover:text-black"
            size={18}
          />
          <Trash2
            className="cursor-pointer text-red-500"
            size={18}
          />
        </div>
      </td>
    </tr>
  );
}
