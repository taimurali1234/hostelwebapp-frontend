interface Props {
  current: { revenue: number; bookings: number };
  previous: { revenue: number; bookings: number };
}

export default function ComparePeriod({
  current,
  previous,
}: Props) {
  const revenueDiff =
    ((current.revenue - previous.revenue) /
      previous.revenue) *
    100;

  return (
    <div className="border border-[#989FAD] rounded-xl p-4 bg-white mb-6">
      <h3 className="font-semibold mb-3">
        Period Comparison
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">
            Revenue Change
          </p>
          <p
            className={`text-lg font-semibold ${
              revenueDiff >= 0
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {revenueDiff.toFixed(1)}%
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Booking Change
          </p>
          <p className="text-lg font-semibold text-blue-600">
            {current.bookings - previous.bookings}
          </p>
        </div>
      </div>
    </div>
  );
}
