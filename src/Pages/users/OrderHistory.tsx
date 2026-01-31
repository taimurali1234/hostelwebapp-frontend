import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  DollarSign,
  ChevronRight,
  Loader,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";
import UserLayout from "../../components/layouts/UserLayout";
import { useUserOrders } from "../../hooks/useUserOrders";
import Pagination from "../../components/common/Pagination";
import type { BookingStatus } from "../../types/order.types";

const statusColors: Record<BookingStatus, { bg: string; text: string; border: string }> = {
  PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300" },
  RESERVED: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
  CONFIRMED: { bg: "bg-green-100", text: "text-green-800", border: "border-green-300" },
  COMPLETED: { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300" },
  CANCELLED: { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" },
};

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "PENDING", label: "Pending" },
  { value: "RESERVED", label: "Reserved" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { orders, loading, error, total, page, limit, refetch } = useUserOrders({
    page: 1,
    limit: 10,
    status: statusFilter,
    search: searchQuery,
  });

  const handleSearch = () => {
    refetch({ page: 1, status: statusFilter, search: searchInput });
    setSearchQuery(searchInput);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    refetch({ page: 1, status: newStatus, search: searchQuery });
  };

  const handlePageChange = (newPage: number) => {
    refetch({ page: newPage, status: statusFilter, search: searchQuery });
  };

  const handleViewDetails = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  if (error && !loading && orders.length === 0) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-600" size={24} />
              <h2 className="text-lg font-bold text-red-800">Error</h2>
            </div>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Order History</h1>
            <p className="text-gray-600">View and manage all your orders</p>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search by Order Number
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      placeholder="Enter order number..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors cursor-pointer"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Filter size={16} className="inline mr-2" />
                  Filter by Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-6 text-sm text-gray-600">
            Showing <span className="font-semibold">{orders.length}</span> of{" "}
            <span className="font-semibold">{total}</span> orders
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center gap-4">
                  <Loader className="animate-spin text-green-600" size={40} />
                <p className="text-gray-600">Loading orders...</p>
              </div>
            </div>
          )}

          {/* Orders List */}
          {!loading && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusColor = statusColors[order.status] || statusColors.PENDING;

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Order Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <h3 className="text-xl font-bold text-gray-900">
                              {order.orderNumber}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor.bg} ${statusColor.text}`}
                            >
                              {order.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            {/* Date */}
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar size={16} />
                              <span>
                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>

                            {/* Amount */}
                            <div className="flex items-center gap-2 text-gray-600">
                              <DollarSign size={16} />
                              <span className="font-semibold text-gray-900">
                                PKR {order.totalAmount?.toLocaleString()}
                              </span>
                            </div>

                            {/* Bookings Count */}
                            <div className="flex items-center gap-2 text-gray-600">
                              <span className="text-sm">
                                <span className="font-semibold text-gray-900">
                                  {order.bookings?.length || 0}
                                </span>{" "}
                                Booking{order.bookings?.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => handleViewDetails(order.id)}
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                        >
                          View Details
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && orders.length === 0 && !error && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="flex justify-center mb-4">
                <Calendar className="text-gray-400" size={48} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-600">
                {searchQuery || statusFilter
                  ? "No orders match your search criteria. Try adjusting your filters."
                  : "You haven't placed any orders yet. Start booking a room today!"}
              </p>
            </div>
          )}

          {/* Pagination */}
          {!loading && orders.length > 0 && total > limit && (
            <div className="mt-8 flex justify-center">
              <Pagination
                page={page}
                totalPages={Math.ceil(total / limit)}
                limit={limit}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}
