import {  Search, X } from "lucide-react";
import { useState } from "react";
import type { CreateBookingForm } from "../../../types/booking.types";
import AddBookingModal from "./BookingModel";
export interface BookingFiltersProps {
  filters: {
    search: string;
    status: string;
    bookingType: string;
    source: string;
  };
  onChange: (
    key: "search" | "status" | "bookingType" | "source",
    value: string
  ) => void;
  onClear: () => void;
}


export function BookingFilters({
  filters,
  onChange,
  onClear,
}: BookingFiltersProps) {
   const [open, setOpen] = useState<boolean>(false);
     const handleCreateBooking = (data: CreateBookingForm) => {
  console.log("SEND TO BACKEND:", data);
};
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="flex items-center w-100 gap-2 bg-gray-100 px-4 py-2 rounded-lg border">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by user or room..."
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>

        {/* Booking Type */}
        <select
          value={filters.bookingType}
          onChange={(e) => onChange("bookingType", e.target.value)}
          className="bg-gray-100 px-4 py-2 rounded-lg border text-sm outline-none"
        >
          <option value="">All Booking Types</option>
          <option value="SHORT_TERM">Short Term</option>
          <option value="LONG_TERM">Long Term</option>
        </select>

        {/* Booking Status */}
        <select
          value={filters.status}
          onChange={(e) => onChange("status", e.target.value)}
          className="bg-gray-100 px-4 py-2 rounded-lg border text-sm outline-none"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="RESERVED">Reserved</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="COMPLETED">Completed</option>
        </select>

        {/* Source */}
        <select
          value={filters.source}
          onChange={(e) => onChange("source", e.target.value)}
          className="bg-gray-100 px-4 py-2 rounded-lg border text-sm outline-none"
        >
          <option value="">All Sources</option>
          <option value="WEBSITE">Website</option>
          <option value="ADMIN">Admin</option>
        </select>

        {/* Clear */}
        <button
          onClick={onClear}
          className="flex items-center gap-2 px-4 py-2 text-sm 
          bg-white border rounded-lg cursor-pointer hover:bg-gray-100"
        >
          <X size={16} />
          Clear Filters
        </button>
      </div>

      {/* Optional Action Button */}
      {/* <button
      onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm 
        bg-white border rounded-lg cursor-pointer hover:bg-gray-100"
      >
        <Plus size={16} />
        Add Manual Booking
      </button> */}
      <AddBookingModal
  open={open}
  onClose={() => setOpen(false)}
  onSubmit={handleCreateBooking}
/>
    </div>
  );
}
