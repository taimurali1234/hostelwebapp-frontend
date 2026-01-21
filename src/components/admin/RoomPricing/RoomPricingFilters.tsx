import { X } from "lucide-react";
import type { RoomType, StayType } from "../../../types/roomPricing.types";

interface RoomPricingFiltersProps {
  filters: {
    roomType: string;
    stayType: string;
    isActive: string;
  };
  onChange: (key: "roomType" | "stayType" | "isActive", value: string) => void;
  onClear: () => void;
  onAddClick: () => void;
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

export function RoomPricingFilters({
  filters,
  onChange,
  onClear,
  onAddClick,
}: RoomPricingFiltersProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Room Type Filter */}
        <select
          value={filters.roomType}
          onChange={(e) => onChange("roomType", e.target.value)}
          className="bg-gray-100 px-4 py-2 rounded-lg border text-sm outline-none"
        >
          <option value="">All Room Types</option>
          {roomTypes.map((type) => (
            <option key={type} value={type}>
              {type.replace(/_/g, " ")}
            </option>
          ))}
        </select>

        {/* Stay Type Filter */}
        <select
          value={filters.stayType}
          onChange={(e) => onChange("stayType", e.target.value)}
          className="bg-gray-100 px-4 py-2 rounded-lg border text-sm outline-none"
        >
          <option value="">All Stay Types</option>
          {stayTypes.map((type) => (
            <option key={type} value={type}>
              {type.replace(/_/g, " ")}
            </option>
          ))}
        </select>

        {/* Active Status Filter */}
        <select
          value={filters.isActive}
          onChange={(e) => onChange("isActive", e.target.value)}
          className="bg-gray-100 px-4 py-2 rounded-lg border text-sm outline-none"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {/* Clear Filters Button */}
        <button
          onClick={onClear}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-white border rounded-lg cursor-pointer hover:bg-gray-100"
        >
          <X size={16} />
          Clear Filters
        </button>
      </div>

      {/* Add Button */}
      <button
        onClick={onAddClick}
        className="flex items-center gap-2 px-4 py-2 text-sm bg-white border rounded-lg cursor-pointer hover:bg-gray-100"
      >
        + Add Room Pricing
      </button>
    </div>
  );
}
