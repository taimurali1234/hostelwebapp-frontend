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
        const dashboardData = res.data;
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

  const summary = data.data.summary;
  const roomOccupancy = data.data.roomOccupancy;
  const bookingData = data.data.bookings;

  return (
    <AdminLayout>
      <div className="bg-surface">
        <DashbaordHeader />

        {/* 🔹 TOP STAT CARDS */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          <StatCard
            title="Today's Booked Rooms"
            value={summary.todayBookedRooms}
          />
          <StatCard
            title="Pending Bookings"
            value={bookingData.pending.count}
          />
          <StatCard
            title="Confirmed Bookings"
            value={bookingData.confirmed.count}
          />
          <StatCard
            title="Available Rooms"
            value={summary.availableRoomsCount}
          />
          <StatCard
            title="Occupied Rooms"
            value={summary.occupiedRoomsCount}
          />
          <StatCard
            title="Total Revenue"
            value={`PKR ${(summary.totalRevenue || 0).toLocaleString()}`}
          />
        </div>

        {/* 🔹 ROOMS BY TYPE */}
        <div className="text-text-primary font-medium text-xl mb-2">
          Rooms by Type
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {roomOccupancy.seatsByRoomType?.map((room) => {
            // Calculate occupied rooms based on occupied seats and beds per room
            const bedsPerRoom = room.totalSeats / room.totalRooms || 0;
            const occupiedRooms = Math.ceil(room.occupiedSeats / bedsPerRoom) || 0;
            
            return (
              <RoomCard
                key={room.roomType}
                title={room.roomType.replace("_", " ")}
                price={0}
                used={`${occupiedRooms}/${room.totalRooms} rooms`}
                totalSeats={room.totalSeats}
                occupiedSeats={room.occupiedSeats}
                availableSeats={room.availableSeats}
              />
            );
          })}
        </div>

        {/* 🔹 BOTTOM GRID */}
        <div className="grid grid-cols-12 gap-6">
          <RoomStatusCard
            booked={summary.occupiedRoomsCount}
            available={summary.availableRoomsCount}
          />

          <FloorStatusCard
            percentage={
              Math.round(
                (summary.occupiedRoomsCount /
                  (summary.occupiedRoomsCount + summary.availableRoomsCount)) *
                  100
              ) || 0
            }
          />

          <BookingChart 
            data={roomOccupancy.seatsByRoomType.map((room) => ({
              month: room.roomType.replace("_", " "),
              count: room.occupiedSeats,
            }))}
          />

          <RecentReviews reviews={data.data.reviews.recentReviews} />
        </div>
      </div>
    </AdminLayout>
  );
}
