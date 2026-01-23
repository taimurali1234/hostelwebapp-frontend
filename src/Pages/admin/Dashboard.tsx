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
import apiClient from "@/services/apiClient";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiClient.get("/dashboard");
        const dashboardData = res.data?.data ?? res.data;
        setData(dashboardData as DashboardData);
      } catch (err) {
        console.error("Dashboard fetch failed", err);
        setData(null);
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
        <div className="p-6">Session expired or no dashboard data</div>
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
            value={data.topCards?.todayBookedRooms ?? 0}
          />
          <StatCard
            title="Pending Rooms"
            value={data.topCards?.pendingRooms ?? 0}
          />
          <StatCard
            title="Available Rooms"
            value={data.topCards?.availableRooms ?? 0}
          />
          <StatCard
            title="Total Revenue"
            value={data.topCards?.totalRevenue ?? 0}
          />
        </div>

        {/* 🔹 ROOMS BY TYPE */}
        <div className="text-text-primary font-medium text-xl mb-2">
          Rooms
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {data.roomsByType?.map((room) => (
            <RoomCard
              key={room.type}
              title={room.type.replace("_", " ")}
              price={0}
              used={`0/${room._count._all}`}
            />
          ))}
        </div>

        {/* 🔹 BOTTOM GRID */}
        <div className="grid grid-cols-12 gap-6">
          <RoomStatusCard
            booked={data.roomStatus?.booked ?? 0}
            available={data.roomStatus?.available ?? 0}
          />

          <FloorStatusCard
            percentage={
              Math.round(
                (data.roomStatus?.booked ?? 0) /
                  ((data.roomStatus?.booked ?? 0) +
                    (data.roomStatus?.available ?? 0)) *
                  100
              ) || 0
            }
          />

          <BookingChart data={data.bookingOverview ?? []} />

          <RecentReviews reviews={data.recentReviews ?? []} />
        </div>
      </div>
    </AdminLayout>
  );
}
