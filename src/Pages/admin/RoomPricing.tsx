import { useState, useMemo } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import RoomPricingHeader from "../../components/admin/RoomPricing/RoomPricingHeader";
import { RoomPricingFilters } from "../../components/admin/RoomPricing/RoomPricingFilters";
import { TableHeader } from "../../components/common/TableHeader";
import { TableCellLoader } from "../../components/common/Loader";
import { RoomPricingRow } from "../../components/admin/RoomPricing/RoomPricingRow";
import type { RoomPricingRowType } from "../../types/roomPricing.types";
import AddRoomPricingModal from "../../components/admin/RoomPricing/AddRoomPricingModal";
import EditRoomPricingModal from "../../components/admin/RoomPricing/EditRoomPricingModal";
import DeleteRoomPricingModal from "../../components/admin/RoomPricing/DeleteRoomPricingModal";
import { useDebounce } from "../../hooks/useDebounce";
import { useDeleteMutation, useCreateMutation, useUpdateMutation } from "../../hooks/useFetchApiQuerry";
import { useRoomPricing } from "../../hooks/useRoomPricingFetch";
import type { CreateRoomPricingForm, EditRoomPricingForm } from "../../types/roomPricing.types";
import { toast } from "react-toastify";

interface RoomPricingFiltersState {
  roomType: string;
  stayType: string;
  isActive: string;
}

const columns = [
  "Room Type",
  "Stay Type",
  "Price",
  "Status",
  "Actions",
];

export default function RoomPricing() {
  const [filters, setFilters] = useState<RoomPricingFiltersState>({
    roomType: "",
    stayType: "",
    isActive: "",
  });

  const [page, setPage] = useState(1);
  const limit = 10;

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedPricingId, setSelectedPricingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedFilters = useDebounce(filters, 500);

  const queryFilters = useMemo(
    () => ({
      roomType: debouncedFilters.roomType,
      stayType: debouncedFilters.stayType,
      isActive: debouncedFilters.isActive,
      page,
      limit,
    }),
    [debouncedFilters, page]
  );

  const { data, isLoading } = useRoomPricing(queryFilters);

  const pricings = data?.items ?? [];
  const total = data?.total ?? 0;

  const createMutation = useCreateMutation<CreateRoomPricingForm>(
    "roomPricing",
    "/api/seat-pricing"
  );

  const updateMutation = useUpdateMutation<EditRoomPricingForm>(
    "roomPricing",
    "/api/seat-pricing",
    selectedPricingId
  );

  const deleteMutation = useDeleteMutation(
    "roomPricing",
    "/api/seat-pricing"
  );

  const handleCreate = (data: CreateRoomPricingForm) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Room pricing created successfully ✅");
        setAddOpen(false);
      },
      onError: (error: unknown) => {
        let message = "Failed to create room pricing";
        if (error instanceof Error) {
          message = error.message;
        }
        toast.error(message);
      },
    });
  };

  const handleEdit = (id: string) => {
      setSelectedPricingId(id);
      setEditOpen(true);
    
  };

  const handleUpdate = (data: EditRoomPricingForm) => {
    console.log("handleUpdate called with data:", data);
    console.log("selectedPricingId:", selectedPricingId);

    if (!data.id && !selectedPricingId) {
      toast.error("Pricing ID is missing");
      console.error("No ID found in data or selectedPricingId");
      return;
    }

    // Use data.id if available, otherwise use selectedPricingId
    const idToUse = data.id || selectedPricingId;
    console.log("Updating with ID:", idToUse);

    updateMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Room pricing updated successfully ✅");
        setEditOpen(false);
        setSelectedPricingId(null);
      },
      onError: (error: unknown) => {
        let message = "Failed to update room pricing";
        if (error instanceof Error) {
          message = error.message;
        }
        console.error("Update error:", error);
        toast.error(message);
      },
    });
  };

  const handleDeleteClick = (pricingId: string) => {
    setSelectedPricingId(pricingId);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedPricingId) {
      setIsDeleting(true);
      deleteMutation.mutate(selectedPricingId, {
        onSuccess: () => {
          toast.success("Room pricing deleted successfully ✅");
          setDeleteOpen(false);
          setSelectedPricingId(null);
          setIsDeleting(false);
        },
        onError: (error: unknown) => {
          let message = "Failed to delete room pricing";
          if (error instanceof Error) {
            message = error.message;
          }
          toast.error(message);
          setIsDeleting(false);
        },
      });
    }
  };

  return (
    <AdminLayout>
      <div className="bg-surface">
        <RoomPricingHeader />

        <RoomPricingFilters
          filters={filters}
          onChange={(key, value) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
            setPage(1);
          }}
          onClear={() => {
            setFilters({ roomType: "", stayType: "", isActive: "" });
            setPage(1);
          }}
          onAddClick={() => setAddOpen(true)}
        />

        <div className="overflow-x-auto">
          <div className="max-h-[250px] overflow-y-auto rounded-lg">
            <table className="w-full text-sm">
              <TableHeader columns={columns} />
              <tbody className="max-h-[100px] overflow-y-scroll">
                {isLoading ? (
                  <TableCellLoader colSpan={columns.length} text="Loading pricing..." />
                ) : pricings.length > 0 ? (
                  pricings.map((pricing) => (
                    <RoomPricingRow
                      key={pricing.id}
                      pricing={pricing}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-8 text-gray-500">
                      No room pricing found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && pricings.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-600">
                Page {page} of {Math.ceil(total / limit)}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 cursor-pointer hover:bg-gray-100"
                >
                  Prev
                </button>
                <button
                  onClick={() =>
                    setPage((prev) =>
                      Math.min(prev + 1, Math.ceil(total / limit))
                    )
                  }
                  disabled={page >= Math.ceil(total / limit)}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 cursor-pointer hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        <AddRoomPricingModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onSubmit={handleCreate}
        />

        <EditRoomPricingModal
  open={editOpen}
  pricingId={selectedPricingId}   // ✅ only ID
  onClose={() => {
    setEditOpen(false);
    setSelectedPricingId(null);
  }}
  onSubmit={handleUpdate}
/>



        <DeleteRoomPricingModal
          open={deleteOpen}
          onClose={() => {
            setDeleteOpen(false);
            setSelectedPricingId(null);
          }}
          onConfirm={handleDeleteConfirm}
          isLoading={isDeleting}
        />
      </div>
    </AdminLayout>
  );
}
