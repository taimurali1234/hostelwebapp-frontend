import { DollarSign, Clock, ArrowUpRight, XCircle } from "lucide-react";
import PaymentStatCard from "./PaymentStatCard";

export default function PaymentStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      
      {/* 💰 Total Revenue */}
      <PaymentStatCard
        title="Total Revenue"
        value="$2565.00"
        subtitle="From paid transactions"
        icon={<DollarSign size={26} color="#2CD599" />}
      />

      {/* ⏳ Pending Payments */}
      <PaymentStatCard
        title="Pending Payments"
        value="$2370.00"
        subtitle="Awaiting confirmation"
        icon={<Clock size={26} color="#DAD604" />}
      />

      {/* 📈 Total Transactions */}
      <PaymentStatCard
        title="Total Transactions"
        value={10}
        subtitle="In selected period"
        icon={<ArrowUpRight size={26} color="#1A61B6" />}
      />

      {/* ❌ Failed Transactions */}
      <PaymentStatCard
        title="Failed Transactions"
        value={2}
        subtitle="Payment failures"
        icon={<XCircle size={26} color="#EF4444" />}
      />
    </div>
  );
}
