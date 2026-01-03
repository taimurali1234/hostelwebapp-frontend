import { Search, X, Plus } from "lucide-react";
import { useState } from "react";
import AddNotificationModal, {
  type CreateNotificationForm,
} from "./AddNotificationModel";

export interface NotificationsFiltersProps {
  filters: {
    search: string;
    audience: string;
    severity: string;
    read: string;
  };
  onChange: (
    key: "search" | "audience" | "severity" | "read",
    value: string
  ) => void;
  onClear: () => void;
}

export function NotificationsFilters({
  filters,
  onChange,
  onClear,
}: NotificationsFiltersProps) {
  const [open, setOpen] = useState(false);

  const handleCreateNotification = (
    data: CreateNotificationForm
  ) => {
    console.log("SEND TO BACKEND:", data);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg border">
            <Search size={18} className="text-gray-500" />
            <input
              placeholder="Search title or message..."
              value={filters.search}
              onChange={(e) =>
                onChange("search", e.target.value)
              }
              className="bg-transparent outline-none text-sm w-64"
            />
          </div>

          {/* Audience */}
          <select
            value={filters.audience}
            onChange={(e) =>
              onChange("audience", e.target.value)
            }
            className="bg-gray-100 px-4 py-2 rounded-lg border text-sm"
          >
            <option value="">All Audience</option>
            <option value="ALL">All Users</option>
            <option value="USER">Specific User</option>
          </select>

          {/* Severity */}
          <select
            value={filters.severity}
            onChange={(e) =>
              onChange("severity", e.target.value)
            }
            className="bg-gray-100 px-4 py-2 rounded-lg border text-sm"
          >
            <option value="">All Severity</option>
            <option value="INFO">Info</option>
            <option value="SUCCESS">Success</option>
            <option value="WARNING">Warning</option>
            <option value="ERROR">Error</option>
          </select>

          {/* Read */}
          <select
            value={filters.read}
            onChange={(e) =>
              onChange("read", e.target.value)
            }
            className="bg-gray-100 px-4 py-2 rounded-lg border text-sm"
          >
            <option value="">All Status</option>
            <option value="true">Read</option>
            <option value="false">Unread</option>
          </select>

          {/* Clear */}
          <button
            onClick={onClear}
            className="flex items-center gap-2 px-4 py-2 text-sm 
            bg-white border rounded-lg hover:bg-gray-100"
          >
            <X size={16} />
            Clear Filters
          </button>
        </div>

        {/* ADMIN ONLY */}
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm 
          bg-white border rounded-lg hover:bg-gray-100"
        >
          <Plus size={16} />
          Add Notification
        </button>
      </div>

      <AddNotificationModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreateNotification}
      />
    </>
  );
}
