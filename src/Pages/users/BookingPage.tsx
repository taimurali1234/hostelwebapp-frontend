import { useState, useEffect } from "react";
import { useBooking } from "@/context/BookingContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  ImageIcon,
  Trash2,
  AlertCircle,
  Minus,
  Plus,
  Loader,
} from "lucide-react";
import UserLayout from "@/components/layouts/UserLayout";
import apiClient from "@/services/apiClient";
import { toast } from "react-toastify";

const BookingPage = () => {
  const { cartItems, updateCartItem, removeFromCart, clearCart } = useBooking();
  const { user } = useAuth();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => sum + (item.total || 0), 0);

  const [coupon, setCoupon] = useState("");
  const [preview, setPreview] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [confirmingBooking, setConfirmingBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [roomAvailability, setRoomAvailability] = useState<Record<string, { availableSeats: number; bookedSeats: number }>>({});
  const [availabilityLoading, setAvailabilityLoading] = useState<Record<string, boolean>>({});

  const today = new Date().toISOString().split("T")[0];

  /* ---------------- Fetch Room Availability on Mount or Cart Change -------- */
  useEffect(() => {
    const fetchAvailability = async () => {
      const roomIds = cartItems.map(item => item.roomId);
      
      for (const roomId of roomIds) {
        if (roomAvailability[roomId]) continue; // Skip if already fetched
        
        setAvailabilityLoading(prev => ({ ...prev, [roomId]: true }));
        try {
          const response = await apiClient.get(`/rooms/${roomId}`);
          const room = response.data.data;
          setRoomAvailability(prev => ({
            ...prev,
            [roomId]: {
              availableSeats: room.availableSeats || 0,
              bookedSeats: room.bookedSeats || 0,
            }
          }));
        } catch (err) {
          console.error(`Failed to fetch availability for room ${roomId}:`, err);
        } finally {
          setAvailabilityLoading(prev => ({ ...prev, [roomId]: false }));
        }
      }
    };

    if (cartItems.length > 0) {
      fetchAvailability();
    }
  }, [cartItems.length]);

  /* ---------------- Auto-call Preview on Page Load ---------------- */
  useEffect(() => {
    if (cartItems.length > 0 && !hasInvalidDates) {
      handlePreview(false);
    }
  }, []);

  /* ---------------- Seat Change with Availability Check -------- */
  const handleSeatChange = (
    id: string,
    seats: number,
    max: number,
    price: number,
    roomId: string
  ) => {
    const availability = roomAvailability[roomId];
    const maxAvailable = availability?.availableSeats || max;

    // Validate seat count
    if (seats < 1) {
      toast.error("Minimum 1 seat required");
      return;
    }

    if (seats > max) {
      toast.error(`Maximum ${max} seats available in this room`);
      return;
    }

    if (seats > maxAvailable) {
      toast.error(
        `Only ${maxAvailable} seat${maxAvailable !== 1 ? 's' : ''} available for this room`
      );
      return;
    }

    updateCartItem(id, {
      selectedSeats: seats,
      total: seats * price,
    });

    setPreview(null); // reset preview if user changes seats
  };

  /* ---------------- Date Change ---------------- */
  const handleDateChange = (
    id: string,
    field: "checkInDate" | "checkOutDate",
    value: string
  ) => {
    updateCartItem(id, { [field]: value });
    setPreview(null); // reset preview if user changes dates
  };

  /* ---------------- Validation ---------------- */
  const hasInvalidDates = cartItems.some((item) => {
    if (!item.checkInDate) return true;
    if (item.stayType === "SHORT_TERM" && !item.checkOutDate) return true;
    return false;
  });

  /* ---------------- Preview API ---------------- */
  const handlePreview = async (applyCoupon = false) => {
    if (hasInvalidDates) {
      toast.error("Please select required dates for all items");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await apiClient.post("/bookings/preview", {
        price: subtotal,
        couponCode: applyCoupon ? coupon : undefined,
      });

      setPreview(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Preview failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Confirm Booking Function ---------------- */
  const handleConfirmBooking = async () => {
  if (!user) {
    toast.error("Please log in to confirm booking");
    navigate("/login");
    return;
  }

  if (hasInvalidDates) {
    toast.error("Please select required dates for all items");
    return;
  }

  if (!preview) {
    toast.error("Please calculate total amount first");
    return;
  }

  setConfirmingBooking(true);

  try {
    const bookingRequests = cartItems.map((item) => ({
      roomId: item.roomId,
      bookingType: item.stayType,

      checkIn: item.checkInDate,
      checkOut:
        item.stayType === "SHORT_TERM" ? item.checkOutDate : null,

      seatsSelected: item.selectedSeats,

      baseAmount: item.total,
      taxAmount: preview.tax,
      taxPercent: preview.taxPercent,
      discount: preview.couponDiscount || 0,
      couponCode: preview.couponApplied ? coupon : null,

      source: "WEBSITE",
    }));

    const response = await apiClient.post(
      "/bookings/create-multiple",
      { bookings: bookingRequests,totalAmount: preview.totalAmount }
    );

    if (response.data.success) {
      toast.success("Booking request submitted successfully!");

      clearCart();

      navigate("/booking-confirmation", {
  state: {
    orderId: response.data.data.orderId,
    taxPercent: preview.taxPercent,
    taxAmount: preview.tax,
  },
});

    } else {
      toast.error(response.data.message || "Failed to create booking");
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Booking failed");
  } finally {
    setConfirmingBooking(false);
  }
};

  /* ---------------- UI ---------------- */
  return (
    <UserLayout>
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {cartItems.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
              <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
                <ImageIcon size={32} className="text-blue-600" />
              </div>
              <p className="text-2xl font-semibold text-gray-800 mb-2">
                Your cart is empty
              </p>
              <p className="text-gray-600 mb-6">
                Add rooms to your cart to get started
              </p>
              <button
                onClick={() => navigate("/rooms")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition cursor-pointer"
              >
                Browse Rooms
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* LEFT SIDE */}
              <div className="lg:col-span-2 space-y-4">

                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                    Booking Review
                  </h1>
                  <p className="text-xs sm:text-sm lg:text-lg text-gray-600">
                    Review your selections, select dates, and proceed to checkout
                  </p>
                </div>

                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                  Booking Items ({cartItems.length})
                </h2>

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
                  >
                    <div className="p-3 sm:p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">

                        {/* Image */}
                        <div className="shrink-0">
                          {item.image?.url ? (
                            <img
                              src={item.image.url}
                              alt={item.room.title}
                              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-xl"
                            />
                          ) : (
                            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-xl">
                              <ImageIcon size={32} className="text-gray-400 sm:size-10" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-3">

                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900">
                              {item.room.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                              <span className="inline-block bg-blue-50 text-blue-700 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-semibold">
                                {item.stayType === "LONG_TERM"
                                  ? "Long Term"
                                  : "Short Term"}
                              </span>
                            </p>
                          </div>

                          {/* Dates */}
                          <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-xl space-y-2 sm:space-y-3 border border-blue-100">
                            <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide">
                              Stay Dates
                            </p>

                            <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Check-In <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="date"
                                  min={today}
                                  value={item.checkInDate || ""}
                                  onChange={(e) =>
                                    handleDateChange(
                                      item.id,
                                      "checkInDate",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-xs sm:text-sm"
                                />
                              </div>

                              {item.stayType === "SHORT_TERM" && (
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Check-Out{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="date"
                                    min={item.checkInDate || today}
                                    value={item.checkOutDate || ""}
                                    onChange={(e) =>
                                      handleDateChange(
                                        item.id,
                                        "checkOutDate",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-xs sm:text-sm"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Seats + Price */}
                          <div className="flex flex-col gap-3 pt-2">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                  Seats
                                </label>

                                <div className="inline-flex items-center gap-1.5 bg-gray-100 rounded-lg p-1">
                                  <button
                                    onClick={() =>
                                      handleSeatChange(
                                        item.id,
                                        item.selectedSeats - 1,
                                        item.room.beds,
                                        item.priceWithTax,
                                        item.roomId
                                      )
                                    }
                                    disabled={item.selectedSeats <= 1}
                                    className="p-1 hover:bg-white rounded transition disabled:opacity-50 cursor-pointer"
                                  >
                                    <Minus size={14} />
                                  </button>

                                  <input
                                    type="number"
                                    min="1"
                                    max={item.room.beds}
                                    value={item.selectedSeats}
                                    onChange={(e) =>
                                      handleSeatChange(
                                        item.id,
                                        parseInt(e.target.value) || 1,
                                        item.room.beds,
                                        item.priceWithTax,
                                        item.roomId
                                      )
                                    }
                                    className="w-10 text-center bg-transparent border-0 font-semibold text-gray-800 text-sm"
                                  />

                                  <button
                                    onClick={() =>
                                      handleSeatChange(
                                        item.id,
                                        item.selectedSeats + 1,
                                        item.room.beds,
                                        item.priceWithTax,
                                        item.roomId
                                      )
                                    }
                                    disabled={
                                      item.selectedSeats >= item.room.beds ||
                                      item.selectedSeats >= (roomAvailability[item.roomId]?.availableSeats || item.room.beds)
                                    }
                                    className="p-1 hover:bg-white rounded transition disabled:opacity-50 cursor-pointer"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>

                                <span className="text-xs text-gray-600">
                                  Max: {item.room.beds}
                                </span>
                              </div>

                              {/* Availability Info */}
                              <div className="text-xs text-gray-600 pl-2">
                                {availabilityLoading[item.roomId] ? (
                                  <span className="flex items-center gap-1">
                                    <Loader size={12} className="animate-spin" />
                                    Loading availability...
                                  </span>
                                ) : roomAvailability[item.roomId] ? (
                                  <span className="text-green-700 font-medium">
                                    ✓ {roomAvailability[item.roomId].availableSeats} seat{roomAvailability[item.roomId].availableSeats !== 1 ? 's' : ''} available
                                  </span>
                                ) : (
                                  <span className="text-gray-500">Availability info not loaded</span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
                                PKR {item.total.toLocaleString()}
                              </p>

                              <button
                                onClick={() => setDeleteItemId(item.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* RIGHT SIDE SUMMARY */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 sticky top-6 space-y-4 sm:space-y-6">

                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    Order Summary
                  </h3>

                  {/* Subtotal */}
                  <div className="flex justify-between items-center border-b pb-3 sm:pb-4">
                    <span className="text-sm sm:text-base text-gray-700 font-medium">Subtotal</span>
                    <span className="text-base sm:text-lg font-bold text-gray-900">
                      PKR {subtotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Calculate Button */}
                  {!preview && (
                    <button
                      onClick={() => handlePreview(false)}
                      className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base cursor-pointer"
                    >
                      {loading ? "Calculating..." : "Calculate Total Amount"}
                    </button>
                  )}

                  {/* Error */}
                  {error && (
                    <div className="bg-red-50 p-3 sm:p-4 rounded-lg border border-red-200 flex gap-2 sm:gap-3">
                      <AlertCircle size={18} className="text-red-600 shrink-0" />
                      <p className="text-xs sm:text-sm text-red-700 font-medium">
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Tax + Total */}
                  {preview && (
                    <>
                      <div className="flex justify-between items-center bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                        <span className="text-xs sm:text-sm text-gray-700 font-medium">
                          Tax ({preview.taxPercent}%)
                        </span>
                        <span className="text-base sm:text-lg font-bold text-blue-600">
                          PKR {preview.tax.toLocaleString()}
                        </span>
                      </div>

                      {/* Coupon Discount */}
                      {preview.couponApplied && preview.couponDiscount > 0 && (
                        <div className="flex justify-between items-center bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                          <span className="text-xs sm:text-sm text-green-700 font-medium">
                            Coupon ({coupon}) -
                          </span>
                          <span className="text-base sm:text-lg font-bold text-green-600">
                            - PKR {preview.couponDiscount.toLocaleString()}
                          </span>
                        </div>
                      )}

                      <div className="bg-linear-to-br from-slate-50 to-blue-50 p-4 sm:p-6 rounded-xl border-2 border-blue-200">
                        <p className="text-gray-700 text-xs sm:text-sm font-medium">
                          Total Amount
                        </p>
                        <p className="text-2xl sm:text-4xl font-bold text-blue-600">
                          PKR {preview.totalAmount.toLocaleString()}
                        </p>
                      </div>

                      {/* Coupon Applied Success Message */}
                      {preview.couponApplied && (
                        <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200 flex gap-2 sm:gap-3">
                          <div className="text-green-600 shrink-0">✓</div>
                          <p className="text-xs sm:text-sm text-green-700 font-medium">
                            Coupon code "{coupon}" applied successfully! You saved PKR {preview.couponDiscount.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Coupon */}
                  {preview && (
                    <div className="space-y-2 sm:space-y-3">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-900">
                        Have a Coupon?
                      </label>
                      <div className="flex gap-2">
                        <input
                          placeholder="Enter coupon code"
                          value={coupon}
                          onChange={(e) => {
                            setCoupon(e.target.value.toUpperCase());
                          }}
                          className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm"
                        />
                        <button
                          onClick={() => handlePreview(true)}
                          disabled={!coupon.trim()}
                          className="bg-blue-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-medium cursor-pointer"
                        >
                          {loading ? "Applying..." : "Apply"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Confirm Booking */}
                  <button
                    onClick={handleConfirmBooking}
                    disabled={!preview || confirmingBooking}
                    className="w-full bg-linear-to-r from-green-600 to-emerald-600 text-white py-2.5 sm:py-3.5 rounded-lg font-bold disabled:opacity-50 text-sm sm:text-base cursor-pointer flex items-center justify-center gap-2"
                  >
                    {confirmingBooking ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Confirming...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>

                  {/* Clear Cart */}
                  <button
                    onClick={() => setConfirmClear(true)}
                    className="w-full py-2 sm:py-2.5 rounded-lg font-semibold text-red-600 hover:bg-red-50 border border-red-200 text-xs sm:text-sm cursor-pointer"
                  >
                    Clear Cart
                  </button>

                </div>
              </div>
            </div>
          )}

          {/* Clear Modal */}
          {confirmClear && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full space-y-5">
                <h3 className="text-xl font-bold text-gray-900">Clear Cart?</h3>
                <p className="text-gray-600 text-sm">
                  This will remove all items from your cart.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="flex-1 border px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      clearCart();
                      setConfirmClear(false);
                    }}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Item Modal */}
          {deleteItemId && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full space-y-5">
                <h3 className="text-xl font-bold text-gray-900">Delete Item?</h3>
                <p className="text-gray-600 text-sm">
                  Are you sure you want to remove this item from your cart? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteItemId(null)}
                    className="flex-1 border px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      removeFromCart(deleteItemId);
                      setDeleteItemId(null);
                      setPreview(null); // Reset preview when item is deleted
                      toast.success("Item removed from cart");
                    }}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </UserLayout>
  );
};

export default BookingPage;
