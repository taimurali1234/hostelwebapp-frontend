import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { BookingFilters } from "../../components/admin/Booking/BookingFilters";
import { TableHeader } from "../../components/common/TableHeader";
import {
  BookingRow,
} from "../../components/admin/Booking/BookingRow";
import BookingHeader from "../../components/admin/Booking/BookingHeader";
import { TableCellLoader } from "../../components/common/Loader";
import AdminLayout from "../../components/layouts/AdminLayout";
import { useDebounce } from "../../hooks/useDebounce";
import BookingStatCard from "../../components/admin/Booking/BookingStatCards";
import {
  useBookings,
  useUpdateBooking,
  useDeleteBooking,
} from "../../hooks/useBookingsFetch";
import { toast } from "react-toastify";
import UpdateBookingModal from "../../components/admin/Booking/UpdateBookingModel";
import DeleteBookingModal from "../../components/admin/Booking/DeleteBookingModel";
import { ArrowLeft } from "lucide-react";

interface BookingFiltersState {
  search: string;
  status: string;
  bookingType: string;
  source: string;
}

const columns = [
  "Order Number",
  "Booking / User",
  "Room",
  "Seats",
  "Booking Type",
  "Status",
  "Total Amount",
  "Actions",
];

export default function Bookings() {
  const location = useLocation();
  const orderId = (location.state as any)?.orderId || null;

  const [filters, setFilters] = useState<BookingFiltersState>({
    search: "",
    status: "",
    bookingType: "",
    source: "",
  });

  const [page, setPage] = useState(1);
  const limit = 10;

  // Modal state
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const debouncedFilters = useDebounce(filters, 500);

  const queryFilters = useMemo(
    () => ({
      search: debouncedFilters.search,
      status: debouncedFilters.status,
      bookingType: debouncedFilters.bookingType,
      source: debouncedFilters.source,
      page,
      limit,
      orderId,
    }),
    [debouncedFilters, page, orderId]
  );

  const { data, isLoading } = useBookings(queryFilters);
  console.log("Bookings data:", data);
  const updateBookingMutation = useUpdateBooking();
  const deleteBookingMutation = useDeleteBooking();

  const bookings = data?.items ?? [];
  const total = data?.total ?? 0;

  const handleFilterChange = (
    key: keyof BookingFiltersState,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleOpenUpdateModal = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setUpdateModalOpen(true);
  };

  const handleOpenDeleteModal = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setDeleteModalOpen(true);
  };

  const handleUpdateBooking = async (formData: any) => {
  if (!selectedBookingId) return;

  try {
    await updateBookingMutation.mutateAsync({
      id: selectedBookingId,
      payload: formData,
    });

    toast.success("Booking updated successfully");
    setUpdateModalOpen(false);
    setSelectedBookingId(null);
  } catch (error: any) {
    // 🔥 Backend error message priority
    const backendMessage =
      error?.response?.data?.message ||
      error?.data?.message ||
      error?.message ||
      "Failed to update booking";

    toast.error(backendMessage);
  }
};


  const handleDeleteBooking = async () => {
    if (!selectedBookingId) return;

    try {
      await deleteBookingMutation.mutateAsync(selectedBookingId);
      toast.success("Booking deleted successfully");
      setDeleteModalOpen(false);
      setSelectedBookingId(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete booking"
      );
    }
  };

  const handleViewBooking = (bookingId: string) => {
    toast.info(`View booking details: ${bookingId}`);
    // Implement navigation to detail page later
  };

  // Calculate stats from the data
  const totalBookings = total || 0;
  const pendingCount = bookings.filter(b => b.status === "PENDING").length;
  const reservedCount = bookings.filter(b => b.status === "RESERVED").length;
  const confirmedCount = bookings.filter(b => b.status === "CONFIRMED").length;
  const cancelledCount = bookings.filter(b => b.status === "CANCELLED").length;
  const completedCount = bookings.filter(b => b.status === "COMPLETED").length;

  return (
    <AdminLayout>
      <div className="bg-surface">
        {orderId && (
          <div className="p-4 border-b border-gray-200 flex items-center gap-2">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer flex items-center gap-2 text-blue-600"
            >
              <ArrowLeft size={20} />
              Back to Orders
            </button>
          </div>
        )}
        <BookingHeader />
        <div className="flex gap-6 flex-wrap mb-6">
          <BookingStatCard title="Total Bookings" value={totalBookings} />
          <BookingStatCard
            title="Pending"
            value={pendingCount}
          />
          <BookingStatCard
            title="Reserved"
            value={reservedCount}
            status="reserved"
          />
          <BookingStatCard
            title="Confirmed"
            value={confirmedCount}
            status="confirmed"
          />
          <BookingStatCard
            title="Cancelled"
            value={cancelledCount}
            status="cancelled"
          />
          <BookingStatCard
            title="Completed"
            value={completedCount}
            status="completed"
          />
        </div>
        <h2 className="text-lg font-semibold mb-2">
          Showing {total} Bookings {orderId && `from selected Order`}
        </h2>

        {!orderId && (
          <BookingFilters
            filters={filters}
            onChange={handleFilterChange}
            onClear={() => {
              setFilters({
                search: "",
                status: "",
                bookingType: "",
                source: "",
              });
              setPage(1);
            }}
          />
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <TableHeader columns={columns} />

            <tbody>
              {isLoading ? (
                <TableCellLoader colSpan={8} text="Loading bookings..." />
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <BookingRow
                    key={booking.id || booking.bookingId}
                    booking={booking}
                    showOrderNumber={true}
                    onView={handleViewBooking}
                    onEdit={(id) => handleOpenUpdateModal(id)}
                    onDelete={(id) => handleOpenDeleteModal(id)}
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

        {/* Modals */}
        <UpdateBookingModal
          open={updateModalOpen}
          bookingId={selectedBookingId}
          onClose={() => {
            setUpdateModalOpen(false);
            setSelectedBookingId(null);
          }}
          onUpdate={handleUpdateBooking}
          loading={updateBookingMutation.isPending}
        />

        <DeleteBookingModal
          open={deleteModalOpen}
          bookingId={selectedBookingId}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedBookingId(null);
          }}
          onConfirm={handleDeleteBooking}
          loading={deleteBookingMutation.isPending}
        />
      </div>
    </AdminLayout>
  );
}
