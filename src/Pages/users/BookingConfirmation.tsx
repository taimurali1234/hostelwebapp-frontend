import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Mail } from "lucide-react";
import UserLayout from "@/components/layouts/UserLayout";
import apiClient from "@/services/apiClient";
import { toast } from "react-toastify";

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { orderId} = location.state || {};

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  /* ---------------- Fetch Order Details ---------------- */
  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    apiClient
      .get(`/bookings/order/${orderId}`)
      .then((res) => {
        setOrder(res.data.data);
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          setNotFound(true);
        } else {
          toast.error("Unable to fetch booking details");
        }
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  /* ---------------- Guards ---------------- */
  if (!orderId) {
    return (
      <UserLayout>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-lg text-gray-600 mb-4">
            No order reference found
          </p>
          <button
            onClick={() => navigate("/bookings")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer"
          >
            Back to Cart
          </button>
        </div>
      </UserLayout>
    );
  }

  if (loading) {
    return (
      <UserLayout>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-lg text-gray-600">Loading booking details…</p>
        </div>
      </UserLayout>
    );
  }

  /* ---------------- Order Cancelled / Deleted ---------------- */
  if (notFound) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-blue-50 px-4">
          <div className="bg-white rounded-3xl shadow-lg p-10 max-w-lg text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Booking Not Available
            </h2>
            <p className="text-gray-600 mb-6">
              This order might have been cancelled by the admin or no longer
              exists. If you believe this is a mistake, please contact support.
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/")}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold cursor-pointer"
              >
                Go Home
              </button>
              <button
                onClick={() => navigate("/bookings")}
                className="border border-gray-300 px-6 py-2 rounded-lg font-semibold cursor-pointer"
              >
                My Bookings
              </button>
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }

  /* ---------------- Normal Flow ---------------- */
  const bookings = order.bookings;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const totalGuests = bookings.reduce(
    (sum: number, b: any) => sum + b.seatsSelected,
    0
  );

  const getDefaultImage = (room: any) =>
    room?.images?.length > 0 ? room.images[0].url : "/default-room.jpg";

  return (
    <UserLayout>
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 py-10">
        <div className="max-w-5xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-8">
            <CheckCircle size={80} className="text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-800">
              Booking Request Submitted!
            </h1>
            <p className="text-gray-600 mt-2">
              Order Number:{" "}
              <span className="font-semibold text-lg">
                {order.orderNumber}
              </span>
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-lg p-8 space-y-8">

            {/* Status */}
            <div className="flex justify-center">
              <span className="bg-yellow-500 text-white px-5 py-1 rounded-full text-sm font-semibold">
                {order.status}
              </span>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-gray-600 text-sm">Total Guests</p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalGuests}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <p className="text-gray-600 text-sm">Total Rooms</p>
                <p className="text-2xl font-bold text-purple-600">
                  {bookings.length}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-gray-600 text-sm">Total Amount</p>
                <p className="text-2xl font-bold text-green-600">
                  PKR {order.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Rooms */}
            <div className="space-y-6">
              {bookings.map((booking: any) => (
                <div
                  key={booking.id}
                  className="border border-gray-200 rounded-2xl overflow-hidden"
                >
                  <div className="grid grid-cols-3 gap-6 p-6">
                    <img
                      src={getDefaultImage(booking.room)}
                      alt={booking.room.title}
                      className="w-full h-40 object-cover rounded-lg"
                    />

                    <div className="col-span-2 space-y-4">
                      <h3 className="text-xl font-bold text-gray-800">
                        {booking.room.title}
                      </h3>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Check-In</p>
                          <p className="font-bold">
                            {formatDate(booking.checkIn)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Check-Out</p>
                          <p className="font-bold">
                            {booking.checkOut
                              ? formatDate(booking.checkOut)
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Guests</p>
                          <p className="font-bold">
                            {booking.seatsSelected}
                          </p>
                        </div>
                      </div>

                      <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {booking.bookingType === "SHORT_TERM"
                          ? "Short Term"
                          : "Long Term"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-6 py-4 border-t flex justify-between">
                    <span className="text-gray-600 text-sm">Base Price</span>
                    <span className="text-2xl font-bold text-green-600">
                      PKR {booking.baseAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Email Info */}
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
              <div className="flex gap-4">
                <Mail className="text-blue-600 mt-1" size={24} />
                <p className="text-blue-800 text-sm">
                  You will be notified by email once your booking is approved.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() =>
                  navigate("/payment", { state: { orderId: order.id } })
                }
                className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold cursor-pointer"
              >
                Proceed To Payment
              </button>
              <button
                onClick={() => navigate("/")}
                className="border-2 border-gray-300 py-3 rounded-xl font-bold cursor-pointer"
              >
                Go Home
              </button>
            </div>

          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default BookingConfirmation;
