import { Search, X } from "lucide-react";

export interface PaymentFiltersProps {
  filters: {
    search: string;
    method: string;
    status: string;
  };
  onChange: (
    key: "search" | "method" | "status",
    value: string
  ) => void;
  onClear: () => void;
}

export function PaymentFilters({
  filters,
  onChange,
  onClear,
}: PaymentFiltersProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* 🔍 Search */}
        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg border">
          <Search size={18} className="text-gray-500" />
          <input
            placeholder="Search booking or transaction..."
            value={filters.search}
            onChange={(e) =>
              onChange("search", e.target.value)
            }
            className="bg-transparent outline-none text-sm w-64"
          />
        </div>

        {/* 💳 Payment Method */}
        <select
          value={filters.method}
          onChange={(e) =>
            onChange("method", e.target.value)
          }
          className="bg-gray-100 px-4 py-2 rounded-lg border text-sm"
        >
          <option value="">All Methods</option>
          <option value="CASH">Cash</option>
          <option value="CARD">Card</option>
          <option value="ONLINE">Online</option>
          <option value="BANK_TRANSFER">
            Bank Transfer
          </option>
        </select>

        {/* 📌 Payment Status */}
        <select
          value={filters.status}
          onChange={(e) =>
            onChange("status", e.target.value)
          }
          className="bg-gray-100 px-4 py-2 rounded-lg border text-sm"
        >
          <option value="">All Status</option>
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>

        {/* ❌ Clear Filters */}
        <button
          onClick={onClear}
          className="flex items-center gap-2 px-4 py-2 text-sm 
          bg-white border rounded-lg hover:bg-gray-100"
        >
          <X size={16} />
          Clear Filters
        </button>
      </div>
    </div>
  );
}
