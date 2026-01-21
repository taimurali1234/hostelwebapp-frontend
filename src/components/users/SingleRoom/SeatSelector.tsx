import { Users, Check } from "lucide-react";
import type { Room } from "../Rooms/RoomCard";

// Cache bust: 2026-01-19-fix-selected-ref

interface Props {
  room: Room;
  onSeatSelect: (seatNumber: number | null) => void;
  selectedSeat: number | null;
}

const SeatSelector: React.FC<Props> = ({ room, onSeatSelect, selectedSeat }) => {
  const totalSeats = room.beds || 1;
  
  console.log("[SeatSelector] selectedSeat prop:", selectedSeat);

  const handleSeatClick = (seatNumber: number) => {
    // Toggle: if same seat is clicked, unselect it; otherwise select new seat
    onSeatSelect(selectedSeat === seatNumber ? null : seatNumber);
  };

  return (
    <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-gray-100 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="space-y-1 md:space-y-2">
        <div className="flex items-center gap-2 md:gap-3">
          <Users className="text-green-600" size={20} />
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Select Your Seat</h2>
        </div>
        <p className="text-xs md:text-sm text-gray-500">Choose from {totalSeats} available seat{totalSeats !== 1 ? 's' : ''}</p>
      </div>

      {/* Seat Grid - Responsive columns */}
      <div className="flex flex-wrap gap-2 md:gap-3 lg:gap-4">
        {Array.from({ length: totalSeats }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleSeatClick(i)}
            className={`
              flex items-center justify-center font-bold transition-all duration-200 relative
              w-10 md:w-12.5
              h-10 md:h-12.5 
              rounded-xl border-2 cursor-pointer
              ${
                selectedSeat === i
                  ? "border-green-600 bg-linear-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-200 scale-100"
                  : "border-gray-300 bg-white text-gray-700 hover:border-green-500 hover:bg-green-50 hover:shadow-md"
              }
              text-xs sm:text-sm md:text-base lg:text-lg
              active:scale-95
            `}
            title={selectedSeat === i ? "Click to unselect" : "Click to select"}
          >
            <span className="font-semibold">{i + 1}</span>
            {selectedSeat === i && (
              <Check className="absolute top-1 right-1 md:top-1.5 md:right-1.5 text-white" size={16} strokeWidth={3} />
            )}
          </button>
        ))}
      </div>

      {/* Selection Info */}
      {selectedSeat !== null && (
        <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 md:p-4 flex items-center gap-2">
          <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-green-600 rounded-full"></div>
          <p className="text-xs md:text-sm text-gray-700">
            <span className="font-bold text-green-600">Seat {selectedSeat + 1}</span>
            <span className="text-gray-500"> is selected</span>
          </p>
        </div>
      )}

      {/* Unselect Hint */}
      {selectedSeat !== null && (
        <p className="text-xs text-gray-400 text-center italic">Click the seat again to unselect</p>
      )}
    </div>
  );
};

export default SeatSelector;
