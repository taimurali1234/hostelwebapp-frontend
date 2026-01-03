import { TrendingUp, Users, BedDouble } from "lucide-react";

export default function AnalyticsStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="border border-[#989FAD] rounded-xl p-4 bg-white">
        <p className="text-sm text-gray-600">
          Avg Revenue / Day
        </p>
        <h2 className="text-xl font-semibold mt-1">
          $1,250
        </h2>
        <TrendingUp size={22} className="text-[#1A61B6] mt-2" />
      </div>

      <div className="border border-[#989FAD] rounded-xl p-4 bg-white">
        <p className="text-sm text-gray-600">
          Active Users
        </p>
        <h2 className="text-xl font-semibold mt-1">
          320
        </h2>
        <Users size={22} className="text-[#2CD599] mt-2" />
      </div>

      <div className="border border-[#989FAD] rounded-xl p-4 bg-white">
        <p className="text-sm text-gray-600">
          Room Utilization
        </p>
        <h2 className="text-xl font-semibold mt-1">
          82%
        </h2>
        <BedDouble size={22} className="text-[#1A61B6] mt-2" />
      </div>
    </div>
  );
}
