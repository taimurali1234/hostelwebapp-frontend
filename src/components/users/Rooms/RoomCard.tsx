import { useNavigate } from "react-router";
import { BedDouble, Users, Bath } from "lucide-react";
import type { RoomType } from "../../../types/room.types";

/* ---------------- Types ---------------- */

export interface RoomImage {
  id: string;
  url: string;
}

export interface Room {
  id: string;
  title: string;
  type: RoomType;
  beds: number;
  washrooms: number;
  description: string;

  shortTermPrice?: number | null;
  longTermPrice?: number | null;

  stayType: "LONG_TERM" | "SHORT_TERM";

  /** 🔥 IMPORTANT */
  availableSeats: number;

  images: RoomImage[];
}

/* ---------------- Availability Logic (AVAILABLE SEATS BASED) ---------------- */

const getRoomAvailability = (room: Room) => {
  if (room.availableSeats <= 0) {
    return {
      text: "Full",
      badgeClass: "bg-red-600 text-white",
      isBooked: true,
    };
  }

  return {
    text: `${room.availableSeats} Seat${
      room.availableSeats > 1 ? "s" : ""
    } Available`,
    badgeClass: "bg-green-600 text-white",
    isBooked: false,
  };
};

/* ---------------- Component ---------------- */

const RoomCard: React.FC<{ room: Room }> = ({ room }) => {
  const navigate = useNavigate();
  const availability = getRoomAvailability(room);
  const isBooked = availability.isBooked;

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow 
      hover:shadow-lg transition"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={room.images[0]?.url}
          alt={room.title}
          className="w-full h-56 object-cover 
          hover:scale-110 transition duration-500 cursor-pointer"
        />

        {/* Status Badge */}
        <span
          className={`absolute top-3 right-3 px-3 py-1 
          rounded-full text-xs font-semibold 
          ${availability.badgeClass}`}
        >
          {availability.text}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-lg">{room.title}</h3>

        <div className="flex items-center flex-wrap gap-2 text-sm text-gray-600">
          {/* Beds (info only, NOT availability) */}
          <div className="flex items-center gap-2">
            <BedDouble size={18} className="text-gray-500" />
            <span>{room.beds} Beds</span>
          </div>

          {/* Type */}
          <div className="flex items-center gap-2">
            <Users size={18} className="text-gray-500" />
            <span>{room.type.replaceAll("_", " ")}</span>
          </div>

          {/* Washroom */}
          <div className="flex items-center gap-2">
            <Bath size={18} className="text-gray-500" />
            <span>{room.washrooms} Washroom</span>
          </div>
        </div>

        {/* Prices */}
        <div className="flex items-center mt-4 gap-4 space-y-1">
          {room.shortTermPrice && (
            <p className="text-green-600 font-semibold">
              ${room.shortTermPrice}{" "}
              <span className="text-sm text-gray-500">/ night</span>
            </p>
          )}

          {room.longTermPrice && (
            <p className="text-blue-600 font-semibold">
              ${room.longTermPrice}{" "}
              <span className="text-sm text-gray-500">/ month</span>
            </p>
          )}

          {!room.shortTermPrice && !room.longTermPrice && (
            <p className="text-gray-400">Price not available</p>
          )}
        </div>

        {/* Button */}
        <button
          disabled={isBooked}
          onClick={() => {
            if (!isBooked) {
              navigate(`/rooms/${room.id}`);
            }
          }}
          className={`w-full mt-3 py-2 rounded-full 
          transition font-medium
          ${
            isBooked
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-[#2f9a8a] text-white hover:bg-[#278b7d] cursor-pointer"
          }`}
        >
          {isBooked ? "Not Available" : "View Details"}
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
