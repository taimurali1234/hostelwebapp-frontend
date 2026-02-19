import { DollarSign, Clock, ArrowUpRight, XCircle } from "lucide-react";
import PaymentStatCard from "./PaymentStatCard";

interface PaymentStatsProps {
  totalRevenue: string;
  pendingPayments: number;
  totalTransactions: number;
  failedTransactions: number;
}

export default function PaymentStats({
  totalRevenue,
  pendingPayments,
  totalTransactions,
  failedTransactions,
}: PaymentStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <PaymentStatCard
        title="Total Revenue"
        value={totalRevenue}
        subtitle="From paid transactions"
        icon={<DollarSign size={26} color="#2CD599" />}
      />

      <PaymentStatCard
        title="Pending Payments"
        value={pendingPayments}
        subtitle="Awaiting confirmation"
        icon={<Clock size={26} color="#DAD604" />}
      />

      <PaymentStatCard
        title="Total Transactions"
        value={totalTransactions}
        subtitle="In selected period"
        icon={<ArrowUpRight size={26} color="#1A61B6" />}
      />

      <PaymentStatCard
        title="Failed Transactions"
        value={failedTransactions}
        subtitle="Payment failures"
        icon={<XCircle size={26} color="#EF4444" />}
      />
    </div>
  );
}
