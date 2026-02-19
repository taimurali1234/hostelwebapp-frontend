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
  method: string;
  status: string;
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

interface BackendPayment {
  id?: string;
  bookingOrderId?: string;
  transactionId?: string;
  amountPaid?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  createdAt?: string;
  bookingOrder?: {
    id?: string;
    orderNumber?: string;
  };
}

interface BackendPaymentsResponse {
  success?: boolean;
  data?: BackendPayment[];
  payments?: BackendPayment[];
}

export default function Payments() {
  const [filters, setFilters] =
    useState<PaymentFiltersState>({
      search: "",
      method: "",
      status: "",
    });

  const [payments, setPayments] =
    useState<PaymentRowType[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingPayment, setDeletingPayment] = useState<PaymentRowType | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const debouncedFilters = useDebounce(filters, 500);

  const filteredPayments = useMemo(() => {
    const search = debouncedFilters.search.trim().toLowerCase();
    const method = debouncedFilters.method.trim().toLowerCase();
    const status = debouncedFilters.status.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch =
        !search ||
        payment.bookingOrderId.toLowerCase().includes(search) ||
        payment.transactionId.toLowerCase().includes(search);

      const matchesMethod =
        !method || payment.paymentMethod.toLowerCase() === method;

      const matchesStatus =
        !status || payment.paymentStatus.toLowerCase() === status;

      return matchesSearch && matchesMethod && matchesStatus;
    });
  }, [debouncedFilters, payments]);

  const formatDate = useCallback((value?: string) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  const mapPaymentRow = useCallback((
    payment: BackendPayment
  ): PaymentRowType => ({
    id: payment.id || "",
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
  }), [formatDate]);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);

      const res = await apiClient.get<BackendPaymentsResponse>(
        "/payments"
      );
      console.log("Fetched payments response:", res.data);

      const list = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data?.payments)
          ? res.data.payments
          : [];
          console.log("Parsed payments list:", list);

      setPayments(list.map(mapPaymentRow));
    } catch {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [mapPaymentRow]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

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
      await apiClient.delete(`/payments/${deletingPayment.id}`);
      toast.success("Payment deleted successfully");
      setDeletingPayment(null);
      await fetchPayments();
    } catch (error: unknown) {
      const messageFromApi =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } })
          .response?.data?.message === "string"
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : null;

      toast.error(messageFromApi || "Failed to delete payment");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-surface">
        <PaymentHeader />
        <PaymentStats/>

        <h2 className="text-lg font-semibold mb-2">
          Showing {filteredPayments.length} payments
        </h2>

        <PaymentFilters
          filters={filters}
          onChange={(k, v) =>
            setFilters((p) => ({ ...p, [k]: v }))
          }
          onClear={() =>
            setFilters({
              search: "",
              method: "",
              status: "",
            })
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <TableHeader columns={columns} />
            <tbody>
              {loading ? (
                <TableCellLoader
                  colSpan={7}
                  text="Loading payments..."
                />
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-6 text-gray-500"
                  >
                    No payments found
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p, i) => (
                  <PaymentRow
                    key={p.id || i}
                    payment={p}
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
