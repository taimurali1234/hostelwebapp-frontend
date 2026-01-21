import { useState } from "react";
import { useBooking } from "@/context/BookingContext";
import { ImageIcon, Trash2 } from "lucide-react";
import UserLayout from "@/components/layouts/UserLayout";

const BookingPage = () => {
  const { bookings, removeBooking, clearBookings } = useBooking();

  const [confirmIndex, setConfirmIndex] = useState<number | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const grandTotal = bookings.reduce(
  (sum, b) => sum + Number(b.total || 0),
  0
);


  return (
    <UserLayout>
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-6">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl font-bold text-gray-800">Your Booking Cart</h1>

          {bookings.length > 0 && (
            <button
              onClick={() => setConfirmClear(true)}
              className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          )}
        </div>

        {/* Empty State */}
        {bookings.length === 0 && (
          <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
            <p className="text-lg font-medium">Your booking cart is empty</p>
            <p className="text-sm mt-1">Add rooms to proceed with booking.</p>
          </div>
        )}

        {/* Booking Cards */}
        <div className="space-y-4">
          {bookings.map((b, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-4 sm:items-center"
            >
              {/* Image / Icon */}
              {b.image?.url ? (
                <img
                  src={b.image.url}
                  alt={b.room.title}
                  className="w-full sm:w-24 h-40 sm:h-24 rounded-xl object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder-room.jpg";
                  }}
                />
              ) : (
                <div className="w-full sm:w-24 h-40 sm:h-24 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                  <ImageIcon size={32} />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold text-gray-800 text-lg">
                  {b.room.title}
                </h3>

                <p className="text-sm text-gray-500">
                  Stay Type: <span className="font-medium">{b.stayType}</span>
                </p>

                <p className="text-green-600 font-bold text-lg">
                  PKR {b.total}
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => setConfirmIndex(i)}
                className="flex items-center justify-center gap-2 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 transition w-full sm:w-auto"
              >
                <Trash2 size={16} />
                Remove
              </button>
            </div>
          ))}
        </div>
        {/* Total Summary */}
{bookings.length > 0 && (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    
    <div>
      <p className="text-sm text-gray-500">Total Amount</p>
      <p className="text-2xl font-bold text-green-600">
        PKR {grandTotal.toLocaleString()}
      </p>
    </div>

    <button  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition w-full sm:w-auto">
      Proceed to Checkout
    </button>

  </div>
)}

        {/* Remove Confirmation Modal */}
        {confirmIndex !== null && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 shadow-xl">
              <h3 className="text-lg font-bold text-gray-800">
                Remove Booking?
              </h3>
              <p className="text-sm text-gray-600">
                Are you sure you want to remove this room from your cart?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmIndex(null)}
                  className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    removeBooking(confirmIndex);
                    setConfirmIndex(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Clear All Confirmation Modal */}
        {confirmClear && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 shadow-xl">
              <h3 className="text-lg font-bold text-gray-800">
                Clear All Bookings?
              </h3>
              <p className="text-sm text-gray-600">
                This will remove all rooms from your cart.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    clearBookings();
                    setConfirmClear(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </UserLayout>
  );
};

export default BookingPage;
