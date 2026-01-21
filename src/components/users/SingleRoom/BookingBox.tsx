import { useState, useEffect, useRef } from "react";
import { Calendar, Tag, Users, Check } from "lucide-react";
import type { Room } from "../Rooms/RoomCard";
import apiClient from "@/services/apiClient"; // your axios instance
import { useBooking } from "@/context/BookingContext";
import { toast } from "react-toastify";

interface Props {
  room: Room;
}

interface Pricing {
  baseAmount: number;
  tax: number;
  taxPercent: number;
  couponDiscount: number;
  couponApplied: boolean;
  totalAmount: number;
}

const BookingBox: React.FC<Props> = ({ room }) => {
  const [stayType, setStayType] = useState<"SHORT_TERM" | "LONG_TERM">("SHORT_TERM");
  const [coupon, setCoupon] = useState("");
  const [applyCoupon, setApplyCoupon] = useState(false);
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLDivElement>(null);
  const [justSelectedSeat, setJustSelectedSeat] = useState(false);

  const { addBooking } = useBooking();



  const totalSeats = room.beds || 1;
  const basePrice =
    stayType === "SHORT_TERM" ? room.shortTermPrice || 0 : room.longTermPrice || 0;

  const seatsSelected = selectedSeat !== null ? 1 : 0;

  const handleSeatClick = (seatNumber: number) => {
  setSelectedSeat(selectedSeat === seatNumber ? null : seatNumber);
  setJustSelectedSeat(true); // for scroll trigger
};


  const fetchPreview = async () => {
    // Don't fetch if no seats selected
    if (seatsSelected === 0) {
      setPricing(null);
      return;
    }

    try {
      setLoading(true);

      const res = await apiClient.post("/api/bookings/preview", {
        roomId: room.id,
        seatsSelected: seatsSelected,
        bookingType: stayType,
        price: basePrice,
couponCode: applyCoupon ? coupon : undefined,
      });

      if (res.data?.data) {
        setPricing(res.data.data);
      }
    } catch (err:any) {
      console.error("Preview booking failed", err);
      toast.error(err?.response?.data?.message || "Failed to fetch pricing preview");
      
    } finally {
      setLoading(false);
    }
  };

  // Recalculate when stay type, coupon, or seat selection changes
  useEffect(() => {
    if (basePrice > 0) {
      fetchPreview();
    }
  }, [stayType, selectedSeat, applyCoupon]);

  // Smooth scroll to pricing section when seat is selected
  useEffect(() => {
  if (justSelectedSeat && pricing && totalRef.current) {
    setTimeout(() => {
      totalRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);

    setJustSelectedSeat(false); // reset
  }
}, [pricing]);


  return (
    <div className="bg-white rounded-2xl p-4 md:p-8 shadow-xl border border-gray-100 sticky top-16 space-y-4 md:space-y-6">

      {/* Header */}
      <div className="space-y-1 md:space-y-2">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Book Your Room</h2>
        <p className="text-xs md:text-sm text-gray-500">Secure your stay today</p>
      </div>

      {/* Seat Selection - Integrated */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Users className="text-green-600" size={18} />
          <label className="text-xs md:text-sm font-semibold text-gray-900">
            Select Your Bed
          </label>
        </div>
        
        {/* Seat Buttons - Optimized for 1-5 beds */}
        <div className={`flex ${totalSeats <= 3 ? 'gap-2' : 'gap-1.5'} flex-wrap`}>
          {Array.from({ length: totalSeats }).map((_, i) => (
            <button
              key={i}
              onClick={() => handleSeatClick(i)}
              className={`flex items-center justify-center font-bold transition-all duration-200 relative ${
                totalSeats <= 3
                  ? 'w-14 md:w-16 h-14 md:h-16 text-base md:text-lg'
                  : totalSeats <= 4
                  ? 'w-12 md:w-14 h-12 md:h-14 text-sm md:text-base'
                  : 'w-11 md:w-12 h-11 md:h-12 text-xs md:text-sm'
              } rounded-xl border-2 cursor-pointer active:scale-95 ${
                selectedSeat === i
                  ? "border-green-600 bg-linear-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-200"
                  : "border-gray-300 bg-white text-gray-700 hover:border-green-500 hover:bg-green-50 hover:shadow-md"
              }`}
              title={selectedSeat === i ? "Click to unselect" : "Click to select"}
            >
              <span className="font-bold">{i + 1}</span>
              {selectedSeat === i && (
                <Check
                  className="absolute top-0.5 right-0.5 md:top-1 md:right-1 text-white"
                  size={14}
                  strokeWidth={3}
                />
              )}
            </button>
          ))}
        </div>

        {/* Selection Status */}
        {selectedSeat !== null && (
          <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-2 md:p-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-600 rounded-full"></div>
            <p className="text-xs md:text-sm text-gray-700">
              <span className="font-bold text-green-600">Bed {selectedSeat + 1}</span>
              <span className="text-gray-500"> selected</span>
            </p>
          </div>
        )}

        {selectedSeat === null && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 md:p-3">
            <p className="text-xs md:text-sm text-yellow-800 font-medium">
              ⚠️ Please select a seat to estimate the Total
            </p>
          </div>
        )}
      </div>

      {/* Price Display */}
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

      {/* Stay Type Selection */}
      <div className="space-y-2 md:space-y-3">
        <label className="block text-xs md:text-sm font-semibold text-gray-900">
          Select Stay Type
        </label>
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          {[
            { value: "SHORT_TERM", label: "Short Term", icon: "🌙" },
            { value: "LONG_TERM", label: "Long Term", icon: "📅" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setStayType(option.value as "SHORT_TERM" | "LONG_TERM")}
              className={`p-2 md:p-3 rounded-lg border-2 transition-all font-medium text-xs md:text-sm ${
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
      </div>

      {/* Price Breakdown */}
      {pricing && (
        <div ref={pricingRef} className="bg-gray-50 rounded-xl p-3 md:p-4 space-y-2 md:space-y-3 text-xs md:text-sm scroll-mt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">
              PKR {pricing.baseAmount.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tax ({pricing.taxPercent}%)</span>
            <span className="font-medium text-gray-900">
              PKR {pricing.tax.toLocaleString()}
            </span>
          </div>

          {pricing.couponApplied && (
            <div className="flex justify-between items-center text-green-600">
              <span>Discount</span>
              <span className="font-medium">
                -PKR {pricing.couponDiscount.toLocaleString()}
              </span>
            </div>
          )}

          <div ref={totalRef} className="border-t border-gray-200 pt-2 md:pt-3 flex justify-between items-center">
            <span className="font-bold text-gray-900">Total Amount</span>
            <span className="text-lg md:text-xl font-bold text-green-600">
              PKR {pricing.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Coupon Code */}
      <div className="space-y-2">
  <label className="block text-xs md:text-sm font-semibold text-gray-900">
    Coupon Code (Optional)
  </label>

  <div className="flex gap-2">
    <div className="relative flex-1">
      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      <input
        type="text"
        placeholder="Enter code (e.g., SAVE10)"
        value={coupon}
onChange={(e) => {
  setCoupon(e.target.value.toUpperCase());
  setApplyCoupon(false); // reset apply
}}
        className="w-full border border-gray-300 rounded-lg p-2 pl-9 text-sm"
      />
    </div>

  <button
  disabled={!coupon || selectedSeat === null}
  onClick={() => setApplyCoupon(true)}
  className={`px-4 rounded-lg text-sm font-semibold 
    ${(!coupon || selectedSeat === null)
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
    }`}
>
  Apply
</button>



  </div>

  {pricing?.couponApplied && (
    <p className="text-sm text-green-600 font-medium">
      ✓ Coupon applied! You saved PKR {pricing.couponDiscount.toLocaleString()}
    </p>
  )}
</div>

      {/* CTA Button */}
      <button
  disabled={!pricing}
  onClick={() => {
    addBooking({
      room,
      total: pricing?.totalAmount,
      stayType,
      seat: selectedSeat,
      image: room.images?.[0],
    });
  }}
  className="w-full bg-green-600 text-white font-bold py-3 rounded-lg"
>
  Add to Booking
</button>


      {/* Trust Badge */}
      <div className="text-center text-xs text-gray-500 space-y-1">
        <p>✓ Secure Payment | ✓ Free Cancellation</p>
        <p>✓ 24/7 Customer Support</p>
      </div>
    </div>
  );
};

export default BookingBox;
