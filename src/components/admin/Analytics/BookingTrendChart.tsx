import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: { date: string; bookings: number }[];
}

export default function BookingTrendChart({ data }: Props) {
  return (
    <div className="border border-[#989FAD] rounded-xl p-4 bg-white">
      <h3 className="font-semibold mb-3">Booking Trends</h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="bookings" fill="#2CD599" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
