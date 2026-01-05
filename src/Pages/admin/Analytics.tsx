import { useEffect, useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import AnalyticsHeader from "../../components/admin/Analytics/AnalyticsHeader";
import AnalyticsFilters from "../../components/admin/Analytics/AnalyticsFilters";
import AnalyticsStats from "../../components/admin/Analytics/AnalyticsStats";
import RevenueChart from "../../components/admin/Analytics/RevenueChart";
import BookingTrendChart from "../../components/admin/Analytics/BookingTrendChart";
import ComparePeriod from "../../components/admin/Analytics/ComparePeriod";
import { exportAnalyticsCSV } from "../../components/admin/Analytics/exportAnalytics";

interface AnalyticsComparison {
  current: {
    revenue: number;
    bookings: number;
  };
  previous: {
    revenue: number;
    bookings: number;
  };
}


export default function Analytics() {
  const [range, setRange] = useState("30");
  const [revenue, setRevenue] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [comparison, setComparison] = useState<AnalyticsComparison | null>(null);

  const API = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetch(`${API}/api/analytics/revenue?range=${range}`)
      .then((r) => r.json())
      .then((json) => {
        // Handle backend response structure: { success, message, data: {...} }
        const data = json.data ?? json;
        setRevenue(data);
      });

    fetch(`${API}/api/analytics/bookings?range=${range}`)
      .then((r) => r.json())
      .then((json) => {
        // Handle backend response structure: { success, message, data: {...} }
        const data = json.data ?? json;
        setBookings(data);
      });

    fetch(`${API}/api/analytics/compare?range=${range}`)
      .then((r) => r.json())
      .then((json) => {
        // Handle backend response structure: { success, message, data: {...} }
        const data = json.data ?? json;
        setComparison(data);
      });
  }, [range]);

  return (
    <AdminLayout>
      <div className="bg-surface">
        <AnalyticsHeader />
        <AnalyticsStats/>

        <div className="flex justify-between mb-4">
          <AnalyticsFilters
            range={range}
            onChange={setRange}
          />

          <button
            onClick={() =>
              exportAnalyticsCSV(revenue)
            }
            className="px-4 py-2 border rounded-lg text-sm bg-white"
          >
            Export Report
          </button>
        </div>

        {comparison && (
          <ComparePeriod
            current={comparison.current}
            previous={comparison.previous}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RevenueChart data={revenue} />
          <BookingTrendChart data={bookings} />
        </div>
      </div>
    </AdminLayout>
  );
}
