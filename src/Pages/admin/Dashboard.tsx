import { useEffect, useState } from "react";
import BookingChart from "../../components/admin/Dashboard/BookingChart";
import DashbaordHeader from "../../components/admin/Dashboard/dashboardHeader";
import FloorStatusCard from "../../components/admin/Dashboard/FloorStatusCard";
import RecentReviews from "../../components/admin/Dashboard/RecentReviews";
import RoomCard from "../../components/admin/Dashboard/RoomCard";
import RoomStatusCard from "../../components/admin/Dashboard/RoomStatusCard";
import StatCard from "../../components/admin/Dashboard/StatCard";
import AdminLayout from "../../components/layouts/AdminLayout";
import { type DashboardData } from "../../types/dashboard.types";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const API = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`${API}/api/dashboard/`, {
          credentials: "include",
        });
        const json = await res.json();
        // Handle backend response structure: { success, message, data: {...} }
        const dashboardData = json.data ?? json;
        setData(dashboardData as DashboardData);
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">Loading dashboard...</div>
      </AdminLayout>
    );
  }

  if (!data) {
    return (
      <AdminLayout>
        <div className="p-6">No dashboard data</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-surface">
        <DashbaordHeader />

        {/* 🔹 TOP STAT CARDS */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Today's Book Rooms"
            value={data.topCards.todayBookedRooms}
          />
          <StatCard
            title="Pending Rooms"
            value={data.topCards.pendingRooms}
          />
          <StatCard
            title="Available Rooms"
            value={data.topCards.availableRooms}
          />
          <StatCard
            title="Total Revenue"
            value={data.topCards.totalRevenue}
          />
        </div>

        {/* 🔹 ROOMS BY TYPE */}
        <div className="text-text-primary font-medium text-xl mb-2">
          Rooms
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {data.roomsByType.map((room) => (
            <RoomCard
              key={room.type}
              title={room.type.replace("_", " ")}
              price={0 /* pricing later */}
              used={`0/${room._count._all}`}
            />
          ))}
        </div>

        {/* 🔹 BOTTOM GRID */}
        <div className="grid grid-cols-12 gap-6">
          <RoomStatusCard
            booked={data.roomStatus.booked}
            available={data.roomStatus.available}
          />

          <FloorStatusCard
            percentage={
              Math.round(
                (data.roomStatus.booked /
                  (data.roomStatus.booked +
                    data.roomStatus.available)) *
                  100
              ) || 0
            }
          />

          <BookingChart data={data.bookingOverview} />

          <RecentReviews reviews={data.recentReviews} />
        </div>
      </div>
    </AdminLayout>
  );
}
