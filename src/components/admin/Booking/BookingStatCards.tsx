import { Check, X, Clock, AlertCircle, CheckCircle } from "lucide-react";

type StatStatus = "pending" | "reserved" | "confirmed" | "cancelled" | "completed" | "none";

interface StatCardProps {
  title: string;
  value: number;
  status?: StatStatus;
}

export default function BookingStatCard({
  title,
  value,
  status = "none",
}: StatCardProps) {
  const renderStatusIcon = () => {
    if (status === "pending") {
      return (
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500 text-white">
          <Clock size={14} strokeWidth={3} />
        </span>
      );
    }

    if (status === "reserved") {
      return (
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white">
          <AlertCircle size={14} strokeWidth={3} />
        </span>
      );
    }

    if (status === "confirmed") {
      return (
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white">
          <Check size={14} strokeWidth={3} />
        </span>
      );
    }

    if (status === "cancelled") {
      return (
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white">
          <X size={14} strokeWidth={3} />
        </span>
      );
    }

    if (status === "completed") {
      return (
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500 text-white">
          <CheckCircle size={14} strokeWidth={3} />
        </span>
      );
    }

    return null;
  };

  return (
    <div
      className="
        border
        rounded-xl
        px-6
        py-5
        min-w-55
        bg-white
      "
      style={{ borderColor: "#989FAD" }}
    >
      <p className="text-black text-sm font-medium mb-4">
        {title}
      </p>

      <div className="flex items-center gap-3">
        {renderStatusIcon()}
        <span className="text-black text-3xl font-semibold">
          {value}
        </span>
      </div>
    </div>
  );
}
