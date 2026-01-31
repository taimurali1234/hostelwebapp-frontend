import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit2, Trash2, Search, X } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import apiClient from "@/services/apiClient";
import { toast } from "react-toastify";
import OrderEditModal from "@/components/admin/Orders/OrderEditModal";
import DeleteOrderModal from "@/components/admin/Orders/DeleteOrderModal";
import { TableHeader } from "@/components/common/TableHeader";

const Orders = () => {
  const navigate = useNavigate();

  // State
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  // Modal states
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [deletingOrder, setDeletingOrder] = useState<any>(null);

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      });

      const response = await apiClient.get(`/bookings/orders/admin/all?${params}`);
      setOrders(response.data.data.items);
      setTotal(response.data.data.total);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, search, statusFilter]);

  // Clear filters
  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPage(1);
  };

  // Handle edit
  const handleEdit = (order: any) => {
    setEditingOrder(order);
  };

  // Handle delete
  const handleDelete = (order: any) => {
    setDeletingOrder(order);
  };

  // Handle view bookings
  const handleViewBookings = (order: any) => {
    navigate("/admin/bookings", {
      state: { orderId: order.id, orderNumber: order.orderNumber },
    });
  };

  const formatCurrency = (amount: number) => {
    return `PKR ${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-700",
      RESERVED: "bg-blue-100 text-blue-700",
      CONFIRMED: "bg-green-100 text-green-700",
      CANCELLED: "bg-red-100 text-red-700",
      COMPLETED: "bg-purple-100 text-purple-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const totalPages = Math.ceil(total / limit);

  const columns = ["Order #", "Customer", "Email", "Amount", "Status", "Bookings", "Date", "Actions"];

  return (
    <AdminLayout>
      <div className="bg-surface">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-textPrimary">
            Order Management
          </h1>
          <p className="text-sm text-textSecondary">
            Manage all booking orders and their details
          </p>
        </div>

        {/* Filters Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search Input */}
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg border">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search by order number or customer..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-gray-100 px-4 py-2 rounded-lg border text-sm outline-none cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="RESERVED">Reserved</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>

            {/* Clear Filters Button */}
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition cursor-pointer"
            >
              <X size={18} />
              Clear
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <TableHeader columns={columns} />
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.user.email}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.bookings.length}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-3 flex">
                      <button
                        onClick={() => handleViewBookings(order)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded transition cursor-pointer"
                        title="View Bookings"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(order)}
                        className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 p-1 rounded transition cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(order)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && orders.length > 0 && (
          <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
            <p>
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, total)} of {total} orders
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer transition"
              >
                Previous
              </button>
              <span className="px-3 py-1">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer transition"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Modals */}
        {editingOrder && (
          <OrderEditModal
            order={editingOrder}
            isOpen={true}
            onClose={() => setEditingOrder(null)}
            onUpdate={(data) => {
              // Call API to update order
            apiClient.patch(`/bookings/orders/${editingOrder.id}`, data)
                .then(() => {
                    toast.success("Order updated successfully");
                    setEditingOrder(null);
                    fetchOrders();
                })
                .catch((error) => {
                    const message =
                        error?.response?.data?.message ||
                        error?.message ||
                        "Failed to update order";
                    toast.error(message);
                });
            }}
            isLoading={false}
          />
        )}

        {deletingOrder && (
          <DeleteOrderModal
            isOpen={true}
            onClose={() => setDeletingOrder(null)}
            onConfirm={() => {
              // Call API to delete order
              apiClient.delete(`/bookings/orders/${deletingOrder.id}`)
                .then(() => {
                  toast.success("Order deleted successfully");
                  setDeletingOrder(null);
                  fetchOrders();
                })
                .catch((error) => {
                    const message =
                        error?.response?.data?.message ||
                        error?.message ||
                        "Failed to delete order";
                    toast.error(message);
                });
            }}
            title="Delete Order"
            message={`Are you sure you want to delete order ${deletingOrder.orderNumber}? This action cannot be undone.`}
            isLoading={false}
          />
        )}
      </div>
    </AdminLayout>
  );
};


export default Orders;