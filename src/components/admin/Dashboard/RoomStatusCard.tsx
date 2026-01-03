import type { DashboardData } from "../../../types/dashboard.types";

type StatusItem = {
  label: string;
  value: number;
};

export default function RoomStatusCard({
  booked,
  available,
}: DashboardData["roomStatus"]) {
  const bookedStats: StatusItem[] = [
    { label: "Clean", value: 90 },
    { label: "Dirty", value: 4 },
    { label: "Inspected", value: 60 },
  ];

  const availableStats: StatusItem[] = [
    { label: "Clean", value: 30 },
    { label: "Dirty", value: 19 },
    { label: "Inspected", value: 30 },
  ];

  return (
    <div className="bg-white border border-[#989FAD] rounded-xl p-6 col-span-7">
      <h3 className="text-lg font-semibold mb-4 text-textPrimary">
        Room status
      </h3>

      <div className="grid grid-cols-2 gap-8">
        {/* Occupied */}
        <div>
          <div className="flex justify-between mb-3">
            <span className="font-medium text-textPrimary">
              Occupied rooms
            </span>
            <span className="font-medium text-textPrimary">{booked}</span>
          </div>

          <div className="space-y-2">
            {bookedStats.map((item) => (
              <div
                key={item.label}
                className="flex justify-between text-sm text-textSecondary"
              >
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Available */}
        <div>
          <div className="flex justify-between mb-3">
            <span className="font-medium text-textPrimary">
              Available rooms
            </span>
            <span className="font-medium text-textPrimary">{available}</span>
          </div>

          <div className="space-y-2">
            {availableStats.map((item) => (
              <div
                key={item.label}
                className="flex justify-between text-sm text-textSecondary"
              >
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
