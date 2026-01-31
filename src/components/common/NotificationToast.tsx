import type { BackendSeverity } from "@/types/notification.types";
import { CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";

interface Props {
  title: string;
  message: string;
  severity: BackendSeverity;
}

const severityConfig = {
  SUCCESS: {
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  INFO: {
    icon: Info,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  WARNING: {
    icon: AlertTriangle,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  ERROR: {
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
  },
};

export default function NotificationToast({
  title,
  message,
  severity = "INFO",
}: Props) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <div
      className={`flex gap-3 p-4 rounded-xl shadow-lg border ${config.bg}`}
    >
      <Icon className={`${config.color}`} size={22} />

      <div>
        <p className="font-semibold text-sm text-gray-900">
          {title}
        </p>
        <p className="text-xs text-gray-600 mt-1">
          {message}
        </p>
      </div>
    </div>
  );
}
