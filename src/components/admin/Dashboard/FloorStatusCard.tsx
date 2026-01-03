type Props = {
  percentage?: number;
};

export default function FloorStatusCard({ percentage = 80 }: Props) {
  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white border border-[#989FAD] rounded-xl p-6 flex flex-col col-span-5">
      <h3 className="text-lg font-semibold mb-6 text-textPrimary">
        Floor status
      </h3>

      <div className="flex items-center justify-between">
        {/* Progress */}
        <div className="relative w-44 h-44">
          <svg height="176" width="176">
            {/* Background */}
            <circle
              stroke="#E5E7EB"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx="88"
              cy="88"
            />
            {/* Progress */}
            <circle
              stroke="#6B7280"
              fill="transparent"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              r={normalizedRadius}
              cx="88"
              cy="88"
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "50% 50%",
              }}
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-semibold text-textPrimary">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-600" />
            <span className="text-textSecondary">Completed</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-200" />
            <span className="text-textSecondary">Yet to Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
}
