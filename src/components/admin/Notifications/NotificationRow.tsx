import { Edit2, Trash2 } from "lucide-react";

export interface NotificationRowType {
  id?: string;
  title?: string;
  message: string;
  audience: "ALL" | "USER" | "ADMIN" | "ALL_USERS";
  severity: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  isRead: boolean;
  createdAt?: string;
  userId?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

interface NotificationsRowProps {
  notification: NotificationRowType;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function NotificationsRow({
  notification,
  onEdit,
  onDelete,
}: NotificationsRowProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  const getAudienceLabel = (audience: string) => {
    const labels: Record<string, string> = {
      "ALL_USERS": "All Users",
      "USER": "Specific User",
      "ADMIN": "Admin",
      "ALL": "All Users",
    };
    return labels[audience] || audience;
  };

  return (
    <tr className="border-b last:border-none hover:bg-gray-50">
      <td className="px-6 py-4 font-medium">
        {notification.title || "-"}
      </td>

      <td className="px-6 py-4 text-gray-600 max-w-sm truncate">
        {notification.message}
      </td>

      <td className="px-6 py-4 text-gray-600">
        {getAudienceLabel(notification.audience)}
      </td>

      <td className="px-6 py-4">
        <span
          className={`text-sm font-medium px-2 py-1 rounded ${
            notification.severity === "ERROR"
              ? "text-red-600 bg-red-50"
              : notification.severity === "WARNING"
              ? "text-yellow-600 bg-yellow-50"
              : notification.severity === "SUCCESS"
              ? "text-green-600 bg-green-50"
              : "text-blue-600 bg-blue-50"
          }`}
        >
          {notification.severity}
        </span>
      </td>

      <td className="px-6 py-4">
        <span
          className={`text-sm font-medium px-2 py-1 rounded ${
            notification.isRead
              ? "text-gray-600 bg-gray-100"
              : "text-green-600 bg-green-50"
          }`}
        >
          {notification.isRead ? "Read" : "Unread"}
        </span>
      </td>

      <td className="px-6 py-4 text-gray-600 text-sm">
        {formatDate(notification.createdAt)}
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex gap-3">
          {onEdit && notification.id && (
            <button
              onClick={() => onEdit(notification.id!)}
              className="text-blue-600 hover:text-blue-800 transition"
              title="Edit notification"
            >
              <Edit2 size={18} />
            </button>
          )}
          {onDelete && notification.id && (
            <button
              onClick={() => onDelete(notification.id!)}
              className="text-red-600 hover:text-red-800 transition"
              title="Delete notification"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
