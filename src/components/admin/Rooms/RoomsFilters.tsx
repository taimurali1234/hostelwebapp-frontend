import { Plus, Search, X } from "lucide-react";
import AddRoomModal from "./RoomModel";
import type { CreateRoomForm } from "../../../types/room.types";
import { useState } from "react";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";



export interface RoomFiltersProps {
  filters: {
    title: string;
    beds: number | "";   // 👈 IMPORTANT
    status: string;
    type:string
  };
  onChange: (key: "title" | "beds" | "status" | "type", value: string | number) => void;
  onClear: () => void;
}

export function RoomFilters({ filters, onChange, onClear }: RoomFiltersProps) {
    const [open, setOpen] = useState<boolean>(false);

    const queryClient = useQueryClient();

const createRoomMutation = useMutation({
  mutationFn: async (data: CreateRoomForm) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/rooms/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result;
  },

  onSuccess: () => {
    toast.success("Room created successfully 🎉");

    // 🔥 THIS AUTO REFRESHES ROOMS LIST
    queryClient.invalidateQueries({ queryKey: ["rooms"] });
  },

 onError: (error: unknown) => {
  if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error("Failed to create room");
  }
}
});

const handleCreateRoom = (data: CreateRoomForm) => {
  createRoomMutation.mutate(data);
};



  return (
    <div className="flex items-center justify-between mb-4 relative ">
    <div className="flex flex-wrap items-center gap-4 ">
      {/* Search */}
      <div className="flex items-center w-100 gap-2 bg-gray-100 px-4 py-2 rounded-lg border">
        <Search size={18} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search by room name or floor..."
          value={filters.title}
          onChange={(e) => onChange("title", e.target.value)}
          className="bg-transparent outline-none text-sm w-full"
        />
      </div>

      {/* Bed Type */}
      <select
  value={filters.type}
  onChange={(e) =>
    onChange(
      "type",
      e.target.value === "" ? "" : (e.target.value)
    )
  }
  className="bg-gray-100 px-4 py-2 rounded-lg border text-sm outline-none"
>
  <option value="">All rooms</option>
  <option value="SINGLE">Single</option>
  <option value="DOUBLE_SHARING">Double</option>
  <option value="TRIPLE_SHARING">Tripple</option>
  <option value="QUAD_SHARING">Quad</option>
  <option value="QUINT_SHARING">Quint</option>
  <option value="VIP_SUIT">Vip</option>
</select>

      {/* Status */}
      {/* <select
        value={filters.type}
        onChange={(e) => onChange("type", e.target.value)}
        className="bg-gray-100 px-4 py-2 rounded-lg border text-sm outline-none"
      >
        <option value="">All Status</option>
        <option value="AVAILABLE">Available</option>
        <option value="BOOKED">Booked</option>
      </select> */}
      {/* Status */}
      <select
        value={filters.status}
        onChange={(e) => onChange("status", e.target.value)}
        className="bg-gray-100 px-4 py-2 rounded-lg border text-sm outline-none"
      >
        <option value="">All Status</option>
        <option value="AVAILABLE">Available</option>
        <option value="BOOKED">Booked</option>
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
    <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm 
        bg-white border rounded-lg cursor-pointer hover:bg-gray-100"
      >
        <Plus size={16} />
        Add New Room
      </button>
      <AddRoomModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreateRoom}
      />
      
    </div>
  );
}
