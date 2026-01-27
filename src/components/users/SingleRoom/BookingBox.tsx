import { useState } from "react";
import { Users, Check } from "lucide-react";
import type { Room } from "../Rooms/RoomCard";
import { useBooking } from "@/context/BookingContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface Props {
  room: Room & { availableSeats: number };
}

const BookingBox: React.FC<Props> = ({ room }) => {
  const [stayType, setStayType] =
    useState<"SHORT_TERM" | "LONG_TERM">("SHORT_TERM");
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  const { addToCart } = useBooking();
  const navigate = useNavigate();

  const totalSeats = room.beds || 1;
  const maxAvailableSeats = room.availableSeats;

  const basePrice =
    stayType === "SHORT_TERM"
      ? room.shortTermPrice || 0
      : room.longTermPrice || 0;

  const seatsSelected = selectedSeat !== null ? selectedSeat + 1 : 0;

  /* ---------------- Seat Click Logic (UPDATED) ---------------- */
  const handleSeatClick = (seatNumber: number) => {
  if (seatNumber + 1 > maxAvailableSeats) {
    toast.error(
      `Only ${maxAvailableSeats} seat${
        maxAvailableSeats > 1 ? "s are" : " is"
      } available for this room`
    );
    return;
  }

  // 🔁 TOGGLE LOGIC
  setSelectedSeat((prev) =>
    prev === seatNumber ? null : seatNumber
  );
};


  return (
    <div className="bg-white rounded-2xl p-4 md:p-8 shadow-xl border border-gray-100 sticky top-16 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="space-y-1 md:space-y-2">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Book Your Room
        </h2>
        <p className="text-xs md:text-sm text-gray-500">
          Secure your stay today
        </p>
      </div>

      {/* Seat Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Users className="text-green-600" size={18} />
          <label className="text-xs md:text-sm font-semibold text-gray-900">
            Select Your Bed
          </label>
        </div>

        <div
          className={`flex ${
            totalSeats <= 3 ? "gap-2" : "gap-1.5"
          } flex-wrap`}
        >
          {Array.from({ length: totalSeats }).map((_, i) => {
            const isUnavailable = i + 1 > maxAvailableSeats;

            return (
              <button
                key={i}
                disabled={isUnavailable}
                onClick={() => handleSeatClick(i)}
                className={`flex items-center justify-center font-bold transition-all duration-200 relative
                rounded-xl border-2 cursor-pointer active:scale-95
                ${
                  isUnavailable
                    ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                    : selectedSeat === i
                    ? "border-green-600 bg-linear-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-200"
                    : "border-gray-300 bg-white text-gray-700 hover:border-green-500 hover:bg-green-50 hover:shadow-md"
                }
                ${
                  totalSeats <= 3
                    ? "w-14 md:w-16 h-14 md:h-16 text-base md:text-lg"
                    : totalSeats <= 4
                    ? "w-12 md:w-14 h-12 md:h-14 text-sm md:text-base"
                    : "w-11 md:w-12 h-11 md:h-12 text-xs md:text-sm"
                }
              `}
              >
                <span className="font-bold">{i + 1}</span>
                {selectedSeat === i && !isUnavailable && (
                  <Check
                    className="absolute top-0.5 right-0.5 md:top-1 md:right-1 text-white"
                    size={14}
                    strokeWidth={3}
                  />
                )}
              </button>
            );
          })}
        </div>

        {selectedSeat === null && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 md:p-3">
            <p className="text-xs md:text-sm text-yellow-800 font-medium">
              ⚠️ Please select a seat
            </p>
          </div>
        )}
      </div>

      {/* Base Price */}
      <div className="bg-linear-to-br from-green-50 to-blue-50 rounded-xl p-3 md:p-4 border border-green-200">
        <div className="text-center">
          <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">
            Price per {stayType === "SHORT_TERM" ? "Night" : "Month"}
          </p>
          <p className="text-xl md:text-2xl lg:text-3xl font-bold text-green-600">
            PKR {basePrice.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Stay Type */}
      <div className="grid grid-cols-2 gap-2 md:gap-3">
        {[
          { value: "SHORT_TERM", label: "Short Term", icon: "🌙" },
          { value: "LONG_TERM", label: "Long Term", icon: "📅" },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setStayType(option.value as any)}
            className={`p-2 md:p-3 rounded-lg border-2 transition-all font-medium text-xs md:text-sm
              ${
                stayType === option.value
                  ? "border-green-600 bg-green-50 text-green-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}
          >
            <span className="text-lg md:text-xl mr-1">{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>

      {/* Add to Cart */}
      <button
        disabled={selectedSeat === null}
        onClick={() => {
          if (seatsSelected > maxAvailableSeats) {
            toast.error(
              `Only ${maxAvailableSeats} seat${
                maxAvailableSeats > 1 ? "s are" : " is"
              } available`
            );
            return;
          }

          addToCart({
            id: crypto.randomUUID(),
            roomId: room.id,
            room: {
              title: room.title,
              beds: room.beds,
              availableSeats: room.availableSeats,
              bookedSeats: room.beds - room.availableSeats,
              description: room.description,
            },
            image: room.images?.[0],
            stayType,
            selectedSeats: seatsSelected,
            quantity: 1,
            priceWithTax: basePrice,
            total: basePrice * seatsSelected,
            addedAt: new Date().toISOString(),
          });

          toast.success("Room added to cart!");
          navigate("/bookings");
        }}
        className="w-full bg-green-600 text-white font-bold py-3 rounded-lg disabled:opacity-50"
      >
        Add to Booking Cart
      </button>
    </div>
  );
};

export default BookingBox;
