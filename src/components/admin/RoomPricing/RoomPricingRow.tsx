import { Pencil, Trash2 } from "lucide-react";
import type { RoomPricingRowType } from "../../../types/roomPricing.types";

interface RoomPricingRowProps {
  pricing: RoomPricingRowType;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function RoomPricingRow({ pricing, onEdit, onDelete }: RoomPricingRowProps) {
  return (
    <tr className="border-b border-gray-300 last:border-none">
      <td className="px-6 py-4">{pricing.roomType.replace(/_/g, " ")}</td>
      <td className="px-6 py-4 text-gray-600">{pricing.stayType.replace(/_/g, " ")}</td>
      <td className="px-6 py-4 text-gray-600">PKR {pricing.price.toFixed(2)}</td>
      <td className="px-6 py-4">
        <span
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            pricing.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {pricing.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-4 text-gray-600">
          <Pencil
            size={18}
            className="cursor-pointer hover:text-black"
            onClick={() => onEdit(pricing.id)}
          />
          <Trash2
            size={18}
            className="cursor-pointer hover:text-red-500"
            onClick={() => onDelete(pricing.id)}
          />
        </div>
      </td>
    </tr>
  );
}
