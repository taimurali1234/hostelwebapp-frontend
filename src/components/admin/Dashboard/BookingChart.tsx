import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts";

// const data = [
//   { month: "May", value: 80 },
//   { month: "Jun", value: 60 },
//   { month: "Jul", value: 70 },
//   { month: "Aug", value: 40 },
//   { month: "Sep", value: 90 },
// ];

export default function BookingChart({
  data,
}: {
  data: { month: string; count: number }[];
}) {
  return (
    <div className="col-span-7 border border-[#989FAD] rounded-xl p-4 bg-white">
      <h3 className="font-semibold mb-4">Booking Overview</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <Bar dataKey="count" fill="#2563EB" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
