import { type ReactNode } from "react";

interface PaymentStatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
}

export default function PaymentStatCard({
  title,
  value,
  subtitle,
  icon,
}: PaymentStatCardProps) {
  return (
    <div
      className="flex items-center justify-between 
      border rounded-xl px-6 py-4 bg-white"
      style={{ borderColor: "#989FAD" }}
    >
      <div>
        <p
          className="text-lg mb-4"
          style={{ color: "#000000", fontWeight: 400 }}
        >
          {title}
        </p>

        <h2 className="text-xl font-semibold text-black">
          {value}
        </h2>

        <p className="text-sm text-gray-500">
          {subtitle}
        </p>
      </div>

      <div className="text-2xl">
        {icon}
      </div>
    </div>
  );
}
