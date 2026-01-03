import { Plus } from "lucide-react";

interface NotificationsHeaderProps {
  onCreateClick?: () => void;
}

export default function NotificationsHeader({ onCreateClick }: NotificationsHeaderProps) {
  return (
    <div className="mb-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold">Notifications Management</h1>
        <p className="text-sm text-gray-500">
          Create and manage system notifications
        </p>
      </div>
      <button
        onClick={onCreateClick}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        <Plus size={18} />
        Create Notification
      </button>
    </div>
  );
}
