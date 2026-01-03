import { useState, useMemo } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import RoomsHeader from "../../components/admin/Rooms/RoomsHeader";
import { RoomFilters } from "../../components/admin/Rooms/RoomsFilters";
import { TableHeader } from "../../components/common/TableHeader";
import { TableCellLoader } from "../../components/common/Loader";
import { RoomRow, type  RoomRowType } from "../../components/admin/Rooms/RoomsRow";
import ViewRoomModal from "../../components/admin/Rooms/ViewRoomModal";
import EditRoomModal from "../../components/admin/Rooms/EditRoomModal";

import { useDebounce } from "../../hooks/useDebounce";
import { useDeleteMutation, useUpdateMutation } from "../../hooks/useFetchApiQuerry";
import { useRooms } from "../../hooks/useRoomsFetch";
import type { CreateRoomForm } from "../../types/room.types";
import { toast } from "react-toastify";
import DeleteConfirmModal from "../../components/admin/Rooms/DeleteRoomModel";

interface RoomFiltersState {
  title: string;
  beds: number | "";
  status: string;
  type: string;
}

const columns = [
  "Room name",
  "Bed",
  "Room floor",
  "Status",
  "Booked Seats",
  "Room type",
  "Price",
  "Actions",
];

export default function Rooms() {
  const [filters, setFilters] = useState<RoomFiltersState>({
    title: "",
    beds: "",
    status: "",
    type: "",
  });

  const [page, setPage] = useState(1);
  const limit = 10;

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomRowType | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteRoomId, setDeleteRoomId] = useState<string | null>(null);

  const debouncedFilters = useDebounce(filters, 500);

  const queryFilters = useMemo(
    () => ({
      title: debouncedFilters.title,
      beds: debouncedFilters.beds,
      status: debouncedFilters.status,
      type: debouncedFilters.type,
      page,
      limit,
    }),
    [debouncedFilters, page]
  );

  const { data, isLoading } = useRooms(queryFilters);

  const rooms = data?.items ?? [];
  const total = data?.total ?? 0;
  const updateRoomMutation = useUpdateMutation<CreateRoomForm>(
    "rooms",
    "/api/rooms",
    selectedRoomId
  );

  const handleUpdate = (data: CreateRoomForm) => {
  updateRoomMutation.mutate(data, {
    onSuccess: () => {
      toast.success("Room updated successfully ✅");
      setEditOpen(false);
    },
    onError: (error: unknown) => {
      let message = "Failed to update room";

      if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    },
  });
};
const deleteRoomMutation = useDeleteMutation(
  "rooms",
  "/api/rooms"
);

const handleConfirmDelete = () => {
  if (!deleteRoomId) return;

  deleteRoomMutation.mutate(deleteRoomId, {
    onSuccess: () => {
      toast.success("Room deleted successfully 🗑️");
      setDeleteOpen(false);
      setDeleteRoomId(null);
    },
    onError: (error: unknown) => {
      let message = "Failed to delete room";
      if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
    },
  });
};



const handleDeleteClick = (id: string) => {
  setDeleteRoomId(id);
  setDeleteOpen(true);
};
  const handleView = (room: RoomRowType) => {
    setSelectedRoom(room);
    setViewOpen(true);
  };

  const handleEdit = (id: string) => {
    setSelectedRoomId(id);
    setEditOpen(true);
  };

  return (
    <AdminLayout>
      <div className="bg-surface">
        <RoomsHeader />

        <RoomFilters
          filters={filters}
          onChange={(key, value) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
            setPage(1);
          }}
          onClear={() => {
            setFilters({ title: "", beds: "", status: "", type: "" });
            setPage(1);
          }}
        />

        <div className="overflow-x-auto">
            <div className="max-h-[250px] overflow-y-auto rounded-lg">

          <table className="w-full text-sm ">
            <TableHeader columns={columns} />

            <tbody className="max-h-[100px] overflow-y-scroll">
              {isLoading ? (
                <TableCellLoader colSpan={7} text="Loading rooms..." />
              ) : rooms.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No rooms found
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <RoomRow
                    key={room.id}
                    room={room}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                  />
                ))
              )}
            </tbody>
          </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-600">
              Page {page} of {Math.ceil(total / limit)}
            </span>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={page * limit >= total}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* 🔥 MODALS OUTSIDE TABLE */}
        <ViewRoomModal
          open={viewOpen}
          room={selectedRoom}
          onClose={() => setViewOpen(false)}
        />

        <EditRoomModal
          open={editOpen}
          roomId={selectedRoomId}
          onClose={() => setEditOpen(false)}
          onUpdate={handleUpdate}
        />
        <DeleteConfirmModal
  open={deleteOpen}
  onClose={() => setDeleteOpen(false)}
  onConfirm={handleConfirmDelete}
  loading={deleteRoomMutation.isPending}
  title="Delete Room"
  description="Are you sure you want to delete this room? This action cannot be undone."
/>

      </div>
    </AdminLayout>
  );
}
