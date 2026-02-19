import { useCallback, useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import PaymentHeader from "../../components/admin/Payments/PaymentsHeader";
import { PaymentFilters } from "../../components/admin/Payments/PaymentsFilters";
import {
  PaymentRow,
  type PaymentRowType,
} from "../../components/admin/Payments/PaymentRows";
import { TableHeader } from "../../components/common/TableHeader";
import { TableCellLoader } from "../../components/common/Loader";
import { useDebounce } from "../../hooks/useDebounce";
import PaymentStats from "../../components/admin/Payments/PaymentStats";
import apiClient from "../../services/apiClient";
import { toast } from "react-toastify";
import DeleteOrderModal from "../../components/admin/Orders/DeleteOrderModal";

interface PaymentFiltersState {
  search: string;
  method: "ALL" | "STRIPE" | "EASYPAISA" | "JAZZCASH";
  status: "ALL" | "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
}

interface Payment {
  id: string;
  bookingOrderId: string;
  amountPaid: number | null;
  paymentMethod: "STRIPE" | "EASYPAISA" | "JAZZCASH";
  paymentStatus: "SUCCESS" | "FAILED" | "PENDING" | "REFUNDED";
  transactionId: string;
  createdAt: string;
  bookingOrder?: {
    id?: string;
    orderNumber?: string;
  };
}

interface PaymentsResponse {
  success?: boolean;
  data?: Payment[];
}

const columns = [
  "Order Number",
  "Transaction ID",
  "Method",
  "Paid Amount",
  "Status",
  "Date",
  "Actions",
];

const formatPkr = (amount: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function Payments() {
  const [filters, setFilters] = useState<PaymentFiltersState>({
    search: "",
    method: "ALL",
    status: "ALL",
  });
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingPayment, setDeletingPayment] = useState<PaymentRowType | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);

  const debouncedFilters = useDebounce(filters, 500);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<PaymentsResponse>("/api/payments");
      setPayments(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch {
      setPayments([]);
      toast.error("Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const stats = useMemo(() => {
    const totalRevenue = payments
      .filter((payment) => payment.paymentStatus === "SUCCESS")
      .reduce((sum, payment) => sum + (payment.amountPaid || 0), 0);

    const pendingPayments = payments.filter(
      (payment) => payment.paymentStatus === "PENDING"
    ).length;

    const failedTransactions = payments.filter(
      (payment) => payment.paymentStatus === "FAILED"
    ).length;

    return {
      totalRevenue,
      pendingPayments,
      failedTransactions,
      totalTransactions: payments.length,
    };
  }, [payments]);

  const filteredPayments = useMemo(() => {
    const search = debouncedFilters.search.trim().toLowerCase();

    return payments.filter((payment) => {
      const orderRef =
        payment.bookingOrder?.orderNumber || payment.bookingOrderId || "";
      const matchSearch =
        !search ||
        orderRef.toLowerCase().includes(search) ||
        (payment.transactionId || "").toLowerCase().includes(search);

      const matchMethod =
        debouncedFilters.method === "ALL" ||
        payment.paymentMethod === debouncedFilters.method;

      const matchStatus =
        debouncedFilters.status === "ALL" ||
        payment.paymentStatus === debouncedFilters.status;

      return matchSearch && matchMethod && matchStatus;
    });
  }, [payments, debouncedFilters]);

  const tablePayments = useMemo<PaymentRowType[]>(
    () =>
      filteredPayments.map((payment) => ({
        id: payment.id,
        bookingOrderId:
          payment.bookingOrder?.orderNumber ||
          payment.bookingOrderId ||
          payment.bookingOrder?.id ||
          "-",
        transactionId: payment.transactionId || "-",
        paidAmount:
          typeof payment.amountPaid === "number" ? payment.amountPaid : null,
        paymentMethod: payment.paymentMethod || "-",
        paymentStatus: payment.paymentStatus || "PENDING",
        date: formatDate(payment.createdAt),
      })),
    [filteredPayments]
  );

  const handleDeleteClick = (payment: PaymentRowType) => {
    if (payment.paymentStatus !== "PENDING") {
      toast.error("You can only delete pending payments.");
      return;
    }
    setDeletingPayment(payment);
  };

  const handleConfirmDelete = async () => {
    if (!deletingPayment?.id) return;

    try {
      setDeleteLoading(true);
      await apiClient.delete(`/api/payments/${deletingPayment.id}`);
      toast.success("Payment deleted successfully");
      setDeletingPayment(null);
      await fetchPayments();
    } catch (error: unknown) {
      const messageFromApi =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response
          ?.data?.message === "string"
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : null;

      toast.error(messageFromApi || "Failed to delete payment");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFilterChange = (
    key: "search" | "method" | "status",
    value: string
  ) => {
    setFilters((prev) => {
      if (key === "search") {
        return { ...prev, search: value };
      }
      if (key === "method") {
        return {
          ...prev,
          method: value as PaymentFiltersState["method"],
        };
      }
      return {
        ...prev,
        status: value as PaymentFiltersState["status"],
      };
    });
  };

  return (
    <AdminLayout>
      <div className="bg-surface">
        <PaymentHeader />
        <PaymentStats
          totalRevenue={formatPkr(stats.totalRevenue)}
          pendingPayments={stats.pendingPayments}
          totalTransactions={stats.totalTransactions}
          failedTransactions={stats.failedTransactions}
        />

        <h2 className="text-lg font-semibold mb-2">
          Showing {tablePayments.length} payments
        </h2>

        <PaymentFilters
          filters={filters}
          onChange={handleFilterChange}
          onClear={() =>
            setFilters({
              search: "",
              method: "ALL",
              status: "ALL",
            })
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <TableHeader columns={columns} />
            <tbody>
              {loading ? (
                <TableCellLoader colSpan={7} text="Loading payments..." />
              ) : tablePayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No payments found
                  </td>
                </tr>
              ) : (
                tablePayments.map((payment, index) => (
                  <PaymentRow
                    key={payment.id || index}
                    payment={payment}
                    onDelete={handleDeleteClick}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {deletingPayment && (
          <DeleteOrderModal
            isOpen={true}
            onClose={() => setDeletingPayment(null)}
            onConfirm={handleConfirmDelete}
            title="Delete Payment"
            message={`Are you sure you want to delete payment ${deletingPayment.transactionId}? This action cannot be undone.`}
            isLoading={deleteLoading}
          />
        )}
      </div>
    </AdminLayout>
  );
}
