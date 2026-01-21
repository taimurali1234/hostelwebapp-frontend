import RoomCard, { type userRoomStatus } from "./RoomCard";
import UserRoomFilters from "./UserRoomFilters";
import { useState } from "react";
import type { RoomStatus, RoomType } from "../../../types/room.types";
import { useUserRooms } from "../../../hooks/useUserRoomsFetch";
import UserPagination from "../../common/userPagination";
import SectionHeader from "@/components/common/SectionHeader";



const AllRoomsPage: React.FC = () => {
  const [filters, setFilters] = useState({
  sort: "createdAt_desc",
  status: "",
  type: "",
  page: 1,
  limit: 12,
});


  const { data, isLoading, error } = useUserRooms(filters);
  const totalPages = Math.ceil(
  (data?.total ?? 0) / (filters.limit ?? 12)
);

  return (
  <div className="max-w-7xl mx-auto px-6 pb-16 pt-10">

    {/* Page Header */}
    <SectionHeader title="Explore Our Rooms" subtitle="Find the perfect stay for your needs" />

    {/* Main Layout */}
    <div className="grid grid-cols-1  md:grid-cols-4 gap-8">

      {/* LEFT: Filters */}
      <div className="md:col-span-1 lg:col-span-1">
        <UserRoomFilters
  filters={filters}
  onChange={(newFilters) =>
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }
/>
      </div>

      {/* RIGHT: Rooms */}
      <div className="md:col-span-3 lg:col-span-3">

        {isLoading && (
          <p className="text-center text-gray-500 mt-10">
            Loading rooms...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500 mt-10">
            Failed to load rooms
          </p>
        )}

        {/* Rooms Grid */}
       {!isLoading && data?.items?.length === 0 && (
  <div className="text-center text-gray-500 mt-16">
    <h3 className="text-lg font-semibold">No rooms found</h3>
    <p className="text-sm mt-2">
      Try changing your filters or check back later.
    </p>
  </div>
)}

{data?.items && data.items.length > 0 && (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
    {data.items.map((room) => (
      <RoomCard key={room.id} room={room} />
    ))}
  </div>
)}

        {/* Pagination */}
        <div className="flex justify-center mt-10">
          <UserPagination
            page={filters.page ?? 1}
            totalPages={totalPages}
            onPageChange={(page) =>
              setFilters((prev) => ({ ...prev, page }))
            }
          />
        </div>

      </div>
    </div>
  </div>
);
};

export default AllRoomsPage;
