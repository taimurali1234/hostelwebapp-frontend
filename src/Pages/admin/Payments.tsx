import { useEffect, useMemo, useState } from "react";
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

interface PaymentFiltersState {
  search: string;
  method: string;
  status: string;
}

const columns = [
  "Booking ID",
  "Transaction ID",
  "Method",
  "Status",
  "Date",
  "Actions",
];

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

  const debouncedFilters = useDebounce(filters, 500);

  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      search: debouncedFilters.search,
      method: debouncedFilters.method,
      status: debouncedFilters.status,
    });

    return params.toString();
  }, [debouncedFilters]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPayments = async () => {
      try {
        setLoading(true);
        const API_BASE_URL =
          import.meta.env.VITE_BACKEND_URL;

        const res = await fetch(
          `${API_BASE_URL}/payments?${queryString}`,
          { signal: controller.signal }
        );

        const data = await res.json();
        setPayments(
          Array.isArray(data.payments)
            ? data.payments
            : []
        );
      } catch {
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
    return () => controller.abort();
  }, [queryString]);

  return (
    <AdminLayout>
      <div className="bg-surface">
        <PaymentHeader />
        <PaymentStats/>

        <h2 className="text-lg font-semibold mb-2">
          Showing {payments.length} payments
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
                  colSpan={6}
                  text="Loading payments..."
                />
              ) : payments.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-gray-500"
                  >
                    No payments found
                  </td>
                </tr>
              ) : (
                payments.map((p, i) => (
                  <PaymentRow
                    key={i}
                    payment={p}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
