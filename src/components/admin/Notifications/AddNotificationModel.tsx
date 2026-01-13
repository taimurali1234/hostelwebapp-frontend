import { X } from "lucide-react";
import { useState, useEffect } from "react";

export interface CreateNotificationForm {
  title?: string;
  message: string;
  audience: "ALL_USERS" | "USER" | "ADMIN";
  userId?: string;
  severity: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
}

interface AddNotificationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateNotificationForm) => void;
  loading?: boolean;
  notification?: CreateNotificationForm & { id: string };
  isEdit?: boolean;
}

const initialState: CreateNotificationForm = {
  title: "",
  message: "",
  audience: "ALL_USERS",
  userId: "",
  severity: "INFO",
};

export default function AddNotificationModal({
  open,
  onClose,
  onSubmit,
  loading = false,
  notification,
  isEdit = false,
}: AddNotificationModalProps) {
  const [form, setForm] = useState<CreateNotificationForm>(initialState);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (notification) {
      setForm({
        title: notification.title || "",
        message: notification.message,
        audience: notification.audience,
        userId: notification.userId || "",
        severity: notification.severity,
      });
    } else {
      setForm(initialState);
    }
    setError("");
  }, [notification, open]);

  if (!open) return null;

  const handleChange = (
    key: keyof CreateNotificationForm,
    value: string
  ) => {
    setForm((p) => ({ ...p, [key]: value }));
    setError("");
  };

  const handleSubmit = () => {
  if (!form.message.trim()) {
    setError("Message is required");
    return;
  }

  if (form.audience === "USER" && !form.userId?.trim()) {
    setError("User ID is required when audience is 'Specific User'");
    return;
  }

  // 🔥 CLEAN PAYLOAD
  const payload: CreateNotificationForm = {
    title: form.title || undefined,
    message: form.message,
    audience: form.audience,
    severity: form.severity,
  };

  if (form.audience === "USER") {
    payload.userId = form.userId?.trim();
  }

  onSubmit(payload);
};

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit Notification" : "Create Notification"}
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Title (Optional)
          </label>
          <input
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Notification title"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Notification message"
            rows={4}
            value={form.message}
            onChange={(e) => handleChange("message", e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Audience */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Audience <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.audience}
            onChange={(e) =>
              handleChange(
                "audience",
                e.target.value as "ALL_USERS" | "USER" | "ADMIN"
              )
            }
            disabled={loading}
          >
            <option value="ALL_USERS">All Users</option>
            <option value="USER">Specific User</option>
            <option value="ADMIN">Admin Only</option>
          </select>
        </div>

        {/* User ID - Conditional */}
        {form.audience === "USER" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              User ID <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter user ID"
              value={form.userId || ""}
              onChange={(e) => handleChange("userId", e.target.value)}
              disabled={loading}
            />
          </div>
        )}

        {/* Severity */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Severity <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.severity}
            onChange={(e) =>
              handleChange(
                "severity",
                e.target.value as "INFO" | "SUCCESS" | "WARNING" | "ERROR"
              )
            }
            disabled={loading}
          >
            <option value="INFO">Info</option>
            <option value="SUCCESS">Success</option>
            <option value="WARNING">Warning</option>
            <option value="ERROR">Error</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            )}
            {isEdit ? "Update Notification" : "Send Notification"}
          </button>
        </div>
      </div>
    </div>
  );
}
