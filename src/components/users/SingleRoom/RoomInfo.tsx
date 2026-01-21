import { Wifi, WashingMachine, CookingPot, Snowflake, Wind, Users, Bed, DoorOpen } from "lucide-react";
import type { Room } from "../Rooms/RoomCard";

interface Facility {
  key: string;
  label: string;
  icon: React.ReactNode;
}

interface Props {
  room: Room;
}

const facilities: Facility[] = [
  { key: "wifi", label: "Free WiFi", icon: <Wifi size={24} /> },
  { key: "laundry", label: "Laundry Service", icon: <WashingMachine size={24} /> },
  { key: "kitchen", label: "Shared Kitchen", icon: <CookingPot size={24} /> },
  { key: "freezer", label: "Freezer", icon: <Snowflake size={24} /> },
  { key: "ac", label: "Air Conditioning", icon: <Wind size={24} /> },
];

const RoomInfo: React.FC<Props> = ({ room }) => {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="space-y-2 md:space-y-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">{room.title}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm md:text-base text-gray-600">
          <div className="flex items-center gap-2">
            <Bed size={18} className="md:w-5 md:h-5 text-green-600" />
            <span className="font-medium">{room.beds} Beds</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={18} className="md:w-5 md:h-5 text-green-600" />
            <span className="font-medium">{room.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <DoorOpen size={18} className="md:w-5 md:h-5 text-green-600" />
            <span className="font-medium">Private Room</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-linear-to-br from-green-50 to-blue-50 p-3 md:p-6 rounded-2xl border border-green-100">
        <p className="text-xs sm:text-sm md:text-base lg:text-base text-gray-700 leading-relaxed">
          {room.description}
        </p>
      </div>

      {/* Amenities */}
      <div className="space-y-3 md:space-y-4">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Amenities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
          {facilities.map((facility) => (
            <div
              key={facility.key}
              className="bg-white p-2 md:p-4 rounded-xl border border-gray-200 hover:border-green-600 hover:shadow-lg transition-all text-center space-y-1 md:space-y-2"
            >
              <div className="flex justify-center text-green-600">
                {facility.icon}
              </div>
              <p className="text-xs md:text-sm font-medium text-gray-700">{facility.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomInfo;
