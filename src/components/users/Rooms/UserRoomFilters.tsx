import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface FilterProps {
  filters: {
    sort: string;
    status: string;
    type: string;
  };
  onChange: (filters: Partial<FilterProps["filters"]>) => void;
}

const UserRoomFilters: React.FC<FilterProps> = ({ filters, onChange }) => {
  return (
    <Card className="p-5 rounded-2xl shadow-sm sticky top-24">
      <div className="flex items-center gap-2 mb-5">
        <Filter size={18} className="text-[#2f9a8a]" />
        <h3 className="font-semibold md:text-sm lg:text-lg">Filter Rooms</h3>
      </div>

      <div className="space-y-5">

        {/* Sort */}
        <div>
          <label className="text-sm font-medium text-gray-600">Sort By</label>

          <Select
            value={filters.sort}
            onValueChange={(v) => onChange({ sort: v })}
          >
            <SelectTrigger className="mt-2 rounded-xl border-gray-300">
              <SelectValue placeholder="Newest" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="createdAt_desc">Newest</SelectItem>
              <SelectItem value="shortTermPrice_asc">Per Night (Low to High)</SelectItem>
              <SelectItem value="shortTermPrice_desc">Per Night (High to Low)</SelectItem>
              <SelectItem value="longTermPrice_asc">Long Stay (Low to High)</SelectItem>
              <SelectItem value="longTermPrice_desc">Long Stay (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium text-gray-600">Room Status</label>

          <Select
            value={filters.status || "ALL"}
            onValueChange={(v) => onChange({ status: v === "ALL" ? "" : v })}
          >
            <SelectTrigger className="mt-2 rounded-xl border-gray-300">
              <SelectValue placeholder="All" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="AVAILABLE">Available</SelectItem>
              <SelectItem value="BOOKED">Booked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Type */}
        <div>
          <label className="text-sm font-medium text-gray-600">Room Type</label>

          <Select
            value={filters.type || "ALL"}
            onValueChange={(v) => onChange({ type: v === "ALL" ? "" : v })}
          >
            <SelectTrigger className="mt-2 rounded-xl border-gray-300">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="SINGLE">Single</SelectItem>
              <SelectItem value="DOUBLE_SHARING">Double</SelectItem>
              <SelectItem value="TRIPLE_SHARING">Triple</SelectItem>
              <SelectItem value="QUAD_SHARING">Quad</SelectItem>
              <SelectItem value="QUINT_SHARING">Quint</SelectItem>
              <SelectItem value="VIP_SUIT">VIP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Button */}
        <Button
          variant="outline"
          className="w-full rounded-xl"
          onClick={() =>
            onChange({
              sort: "createdAt_desc",
              status: "",
              type: "",
            })
          }
        >
          Clear Filters
        </Button>
      </div>
    </Card>
  );
};


export default UserRoomFilters;
