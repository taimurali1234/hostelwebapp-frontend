interface AnalyticsFiltersProps {
  range: string;
  onChange: (value: string) => void;
}

export default function AnalyticsFilters({
  range,
  onChange,
}: AnalyticsFiltersProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <select
        value={range}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-100 px-4 py-2 rounded-lg border text-sm"
      >
        <option value="7">Last 7 days</option>
        <option value="30">Last 30 days</option>
        <option value="90">Last 3 months</option>
        <option value="365">Last 1 year</option>
      </select>
    </div>
  );
}
