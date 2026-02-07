import { useParams } from "react-router";
import { useEffect, useState } from "react";

import RoomGallery from "@/components/users/SingleRoom/RoomGallery";
import RoomInfo from "@/components/users/SingleRoom/RoomInfo";
import TestimonialsSection from "@/components/users/Home/TestimonialsSection";
import AiBookingAssistant from "@/components/users/SingleRoom/AiBookingAssistant";
import BookingBox from "@/components/users/SingleRoom/BookingBox";
import UserLayout from "../../components/layouts/UserLayout";

import { getSingleRoom } from "@/services/rooms.api";

export default function SingleRoom() {
  const { id } = useParams();
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchRoom = async () => {
      try {
        const res = await getSingleRoom(id);
        setRoom(res.data.data);
        console.log("Fetched room:", res.data.data);
      } catch (err) {
        console.error("Failed to load room", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  if (loading) {
    return (
      <UserLayout>
        <p className="text-center py-20 text-gray-500">Loading room details...</p>
      </UserLayout>
    );
  }

  if (error || !room) {
    return (
      <UserLayout>
        <p className="text-center py-20 text-red-500">Room not found</p>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      {/* Main Content - Premium Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:mb-20 px-2 md:px-6 py-6">
        {/* Left Content - 8 cols on lg */}
        <div className="lg:col-span-8 space-y-6 md:space-y-8">
          {/* Gallery - Compact and Responsive */}
          <div className="bg-white rounded-2xl p-0 shadow-sm border border-gray-100 overflow-hidden">
            <RoomGallery images={room.room.images} videos={room.room.videos} />
          </div>

          {/* Room Info */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
            <RoomInfo room={room.room} />
          </div>

          {/* Selection Cards - Calendar Only */}
          {/* <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
            <AvailabilityCalendar roomId={room.room.id} />
          </div> */}
        </div>

        {/* Right Booking Box - 4 cols on lg, Sticky on md and up */}
        <div className="lg:col-span-4">
          <div className="sticky top-12">
            <div className="bg-linear-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
              <BookingBox room={room.room} />
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Testimonials - Enhanced */}
          <TestimonialsSection />

      {/* Floating AI Assistant */}
      {/* <AiBookingAssistant room={room.room} /> */}
    </UserLayout>
  );
}
