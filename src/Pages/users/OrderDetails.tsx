import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  User,
  MapPin,
  DollarSign,
  ChevronLeft,
  Loader,
  AlertCircle,
} from "lucide-react";
import UserLayout from "../../components/layouts/UserLayout";
import { fetchOrderDetails } from "../../services/orders.api";
import type { OrderDetail, BookingStatus } from "../../types/order.types";

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("Order ID not provided");
      setLoading(false);
      return;
    }

    const loadOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await fetchOrderDetails(orderId);
        setOrder(response.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader className="animate-spin" size={40} />
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  if (error || !order) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-600" size={24} />
              <h2 className="text-lg font-bold text-red-800">Error</h2>
            </div>
            <p className="text-red-700 mb-6">{error || "Order not found"}</p>
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ChevronLeft size={20} />
              Go Back
            </button>
          </div>
        </div>
      </UserLayout>
    );
  }

  const statusColors: Record<BookingStatus, { bg: string; text: string; border: string }> = {
    PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300" },
    RESERVED: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
    CONFIRMED: { bg: "bg-green-100", text: "text-green-800", border: "border-green-300" },
    COMPLETED: { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300" },
    CANCELLED: { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" },
  };

  const statusColor = statusColors[order.status] || statusColors.PENDING;

  const totalBookings = order.bookings?.length || 0;
  const confirmedBookings = order.bookings?.filter((b) => b.status === "CONFIRMED").length || 0;

  return (
    <UserLayout>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors cursor-pointer"
            >
              <ChevronLeft size={20} />
              Back
            </button>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Status Banner */}
            <div className={`${statusColor.bg} ${statusColor.border} border-b-4 px-6 py-8`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className={`text-3xl font-bold ${statusColor.text} mb-2`}>
                    Order {order.orderNumber}
                  </h1>
                  <p className={`${statusColor.text} text-sm opacity-75`}>
                    Created on {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className={`${statusColor.bg} border-2 ${statusColor.border} rounded-full px-6 py-3`}>
                  <span className={`${statusColor.text} font-bold text-lg`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-blue-600 text-sm font-semibold uppercase mb-2">
                    Total Amount
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    PKR {order.totalAmount?.toLocaleString()}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <p className="text-purple-600 text-sm font-semibold uppercase mb-2">
                    Total Bookings
                  </p>
                  <p className="text-2xl font-bold text-purple-900">{totalBookings}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-green-600 text-sm font-semibold uppercase mb-2">
                    Confirmed
                  </p>
                  <p className="text-2xl font-bold text-green-900">{confirmedBookings}</p>
                </div>
              </div>

              {/* User Info */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <User size={24} />
                  Booking Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Guest Name</p>
                    <p className="text-lg font-semibold text-gray-900">{order.user?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Email Address</p>
                    <p className="text-lg font-semibold text-gray-900">{order.user?.email}</p>
                  </div>
                  {order.user?.phone && (
                    <div>
                      <p className="text-gray-600 text-sm">Phone Number</p>
                      <p className="text-lg font-semibold text-gray-900">{order.user.phone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bookings List */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar size={24} />
                  Bookings ({order.bookings?.length || 0})
                </h2>
                <div className="space-y-4">
                  {order.bookings && order.bookings.length > 0 ? (
                    order.bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">
                              {booking.room?.title || "Room"}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {booking.room?.type?.replace("_", " ")} • Floor {booking.room?.floor}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              booking.status === "CONFIRMED"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>

                        {/* Booking Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          <div className="flex items-start gap-2">
                            <Calendar size={16} className="text-gray-500 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-600">Check-in</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {new Date(booking.checkIn).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {booking.checkOut && (
                            <div className="flex items-start gap-2">
                              <Calendar size={16} className="text-gray-500 mt-0.5" />
                              <div>
                                <p className="text-xs text-gray-600">Check-out</p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {new Date(booking.checkOut).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-start gap-2">
                            <MapPin size={16} className="text-gray-500 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-600">Seats</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {booking.seatsSelected} Seat{booking.seatsSelected !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <DollarSign size={16} className="text-gray-500 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-600">Amount</p>
                              <p className="text-sm font-semibold text-gray-900">
                                PKR {booking.baseAmount?.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="bg-gray-50 rounded p-3 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Base Amount</span>
                            <span className="font-semibold">PKR {booking.baseAmount?.toLocaleString()}</span>
                          </div>
                          {booking.taxAmount > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tax</span>
                              <span className="font-semibold">PKR {booking.taxAmount?.toLocaleString()}</span>
                            </div>
                          )}
                          {booking.discount > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Discount</span>
                              <span className="font-semibold">-PKR {booking.discount?.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-center py-8">No bookings found for this order.</p>
                  )}
                </div>
              </div>

              {/* Total Amount */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between text-xl">
                  <span className="font-bold text-gray-800">Total Order Amount</span>
                  <span className="font-bold text-2xl text-blue-600">
                    PKR {order.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
