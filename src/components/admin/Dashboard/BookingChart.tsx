import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function BookingChart({
  data,

}: {
  data: { month: string; count: number }[];
}) {
    console.log(data);

  return (
    <div className="col-span-7 border border-[#989FAD] rounded-xl p-6 bg-white shadow-sm">
      <div className="mb-6">
        <h3 className="font-bold text-lg text-gray-800">Booking Overview</h3>
        <p className="text-sm text-gray-500 mt-1">Room occupancy by type</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E5E7EB"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            stroke="#6B7280"
            style={{ fontSize: "12px" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="#6B7280"
            style={{ fontSize: "12px" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
            labelStyle={{ color: "#F3F4F6", fontSize: "12px", fontWeight: 600 }}
            formatter={(value: any) => [
              `${value} bookings`,
              "Occupied Seats",
            ]}
            cursor={{ stroke: "#2563EB", strokeWidth: 2 }}
          />

          <Area
            type="monotone"
            dataKey="count"
            stroke="#2563EB"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorCount)"
            dot={{
              fill: "#2563EB",
              r: 5,
              strokeWidth: 2,
              stroke: "#FFFFFF",
            }}
            activeDot={{
              r: 7,
              fill: "#1D4ED8",
              stroke: "#FFFFFF",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-gray-600">Total Occupancy</p>
          <p className="text-xl font-bold text-blue-600 mt-1">
            {data.reduce((sum, item) => sum + item.count, 0)}
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-gray-600">Average</p>
          <p className="text-xl font-bold text-blue-600 mt-1">
            {Math.round(
              data.reduce((sum, item) => sum + item.count, 0) / data.length || 0
            )}
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-gray-600">Room Types</p>
          <p className="text-xl font-bold text-blue-600 mt-1">{data.length}</p>
        </div>
      </div>
    </div>
  );
}
