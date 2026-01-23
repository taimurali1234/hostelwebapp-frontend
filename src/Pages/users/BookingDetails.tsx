import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Loader } from "lucide-react";
import UserLayout from "@/components/layouts/UserLayout";
import apiClient from "@/services/apiClient";
import { toast } from "react-toastify";
import { useState } from "react";

interface BookingState {
  checkInDate: string;
  checkOutDate: string;
  cartItems: any[];
}

const BookingDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Get dates and cart items from previous page
  const state = location.state as BookingState;

  if (!user) {
    navigate("/login");
    return null;
  }

  if (!state?.cartItems || state.cartItems.length === 0) {
    return (
      <UserLayout>
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <p className="text-lg text-gray-600 mb-4">No items to checkout</p>
          <button
            onClick={() => navigate("/bookings")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            Back to Cart
          </button>
        </div>
      </UserLayout>
    );
  }

  const { cartItems, checkInDate, checkOutDate } = state;
  const grandTotal = cartItems.reduce((sum: number, item: any) => sum + (item.total || 0), 0);

  /**
   * Create bookings with confirmed dates
   */
  const handleConfirmBooking = async () => {
    setIsLoading(true);

    try {
      const bookingRequests = cartItems.map((item: any) => ({
        userId: user.userId,
        roomId: item.roomId,
        bookingType: item.stayType,
        seatsSelected: item.selectedSeats,
        checkIn: checkInDate,
        checkOut: item.stayType === "SHORT_TERM" ? checkOutDate : undefined,
        baseAmount: item.total,
        status: "RESERVED" as const,
        source: "USER" as const,
      }));

      const response = await apiClient.post("/bookings/create-multiple", {
        bookings: bookingRequests,
      });

      if (response.data.success) {
        toast.success("Bookings created successfully!");
        navigate("/booking-confirmation", {
          state: { bookingIds: response.data.data?.bookingIds },
        });
      } else {
        toast.error(response.data.message || "Failed to create bookings");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.response?.data?.message || "Failed to process checkout");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <button
          onClick={() => navigate("/bookings")}
          className="flex items-center gap-2 text-gray-900 hover:text-blue-600 mb-6 cursor-pointer transition"
        >
          <ArrowLeft size={18} />
          Back to Cart
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Booking Confirmation</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Booking Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dates Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h3 className="font-bold text-blue-900 mb-4">Your Selected Dates</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-blue-700 font-medium">Check-In</p>
                  <p className="text-lg font-semibold text-blue-900">
                    {new Date(checkInDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                {checkOutDate && (
                  <div>
                    <p className="text-xs text-blue-700 font-medium">Check-Out</p>
                    <p className="text-lg font-semibold text-blue-900">
                      {new Date(checkOutDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Items Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Booking Items</h3>
              <div className="space-y-4">
                {cartItems.map((item: any, idx: number) => (
                  <div key={idx} className="border-b pb-4 last:border-b-0">
                    <div className="flex gap-4">
                      {item.image?.url && (
                        <img
                          src={item.image.url}
                          alt={item.room.title}
                          className="w-20 h-20 rounded-lg object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder-room.jpg";
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.room.title}</p>
                        <p className="text-sm text-gray-600">
                          Stay Type: <span className="font-medium">{item.stayType}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} room{item.quantity > 1 ? "s" : ""} × {item.selectedSeats} seat
                          {item.selectedSeats > 1 ? "s" : ""}
                        </p>
                        <p className="text-sm font-semibold text-green-600 mt-1">
                          PKR {(item.total || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary Box */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6 space-y-4">
              <h3 className="font-bold text-lg text-gray-800">Order Summary</h3>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <p className="text-gray-600">Items</p>
                  <p className="font-semibold">{cartItems.length}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Total Seats</p>
                  <p className="font-semibold">
                    {cartItems.reduce((sum: number, item: any) => sum + item.selectedSeats, 0)}
                  </p>
                </div>
              </div>

              {/* Grand Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between mb-4">
                  <p className="text-lg font-bold text-gray-800">Total</p>
                  <p className="text-2xl font-bold text-green-600">
                    PKR {grandTotal.toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={handleConfirmBooking}
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>

                <button
                  onClick={() => navigate("/bookings")}
                  className="w-full mt-2 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition cursor-pointer"
                >
                  Back to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default BookingDetails;
