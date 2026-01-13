import { FaBed, FaUsers, FaBath } from "react-icons/fa";
import {type Room } from "./FeaturedRooms";

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const isAvailable = room.status === "Available";

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200  hover:shadow-2xl transition-all duration-300 group">

      {/* Image */}
      <div className="relative overflow-hidden cursor-pointer">
        <img
          src={room.image}
          alt={room.title}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Status Badge */}
        <span
          className={`absolute top-3 right-3 px-3 py-1 text-sm font-medium rounded-full text-white
            ${isAvailable ? "bg-green-600" : "bg-red-500"}`}
        >
          {room.status}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {room.title}
        </h3>

        {/* Specs */}
        <div className="flex items-center justify-between text-gray-600 text-sm mb-4">
          <div className="flex items-center gap-2">
            <FaBed />
            <span>{room.beds} Beds</span>
          </div>

          <div className="flex items-center gap-2">
            <FaUsers />
            <span>{room.type}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaBath />
            <span>1 Washroom</span>
          </div>
        </div>

        {/* Price + Button */}
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-black">
            ${room.price}
            <span className="text-sm text-gray-500">/night</span>
          </p>

          <button
            disabled={!isAvailable}
            className={`px-5 py-2 cursor-pointer rounded-full transition font-medium
              ${
                isAvailable
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            {isAvailable ? "Book Now" : "Not Available"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
