import { useCallback, useEffect, useState, type ComponentType } from "react";
import { CreditCard, Wallet, XCircle, X } from "lucide-react";
import apiClient from "@/services/apiClient";
import { toast } from "react-toastify";

interface PaymentMethodModalProps {
  bookingId: string | number;
  amount: number;
  isOpen: boolean;
  onClose: () => void;
}

type PaymentMethod = "stripe" | "easypaisa" | "jazzcash";

interface PaymentMethodConfig {
  key: PaymentMethod;
  title: string;
  subtitle: string;
  icon: ComponentType<{ className?: string }>;
  endpoint: string;
  buttonClassName: string;
}

const paymentMethods: PaymentMethodConfig[] = [
  {
    key: "stripe",
    title: "Stripe",
    subtitle: "Pay with Visa, MasterCard",
    icon: CreditCard,
    endpoint: "/payments/stripe/checkout-session",
    buttonClassName:
      "border-sky-200 bg-gradient-to-r from-sky-50 to-indigo-50 hover:from-sky-100 hover:to-indigo-100",
  },
  {
    key: "easypaisa",
    title: "Easypaisa",
    subtitle: "Pay via Easypaisa wallet",
    icon: Wallet,
    endpoint: "/payments/easypaisa/start",
    buttonClassName:
      "border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100",
  },
  {
    key: "jazzcash",
    title: "JazzCash",
    subtitle: "Pay using JazzCash",
    icon: XCircle,
    endpoint: "/payments/jazzcash/start",
    buttonClassName:
      "border-rose-200 bg-gradient-to-r from-rose-50 to-red-50 hover:from-rose-100 hover:to-red-100",
  },
];

const ButtonSpinner = () => (
  <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
);

const PaymentMethodModal = ({
  bookingId,
  amount,
  isOpen,
  onClose,
}: PaymentMethodModalProps) => {
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [activeMethod, setActiveMethod] = useState<PaymentMethod | null>(null);

  const handleClose = useCallback(() => {
    setIsAnimatingIn(false);
    setActiveMethod(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const frame = window.requestAnimationFrame(() => {
      setIsAnimatingIn(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const isAnyMethodLoading = activeMethod !== null;

  const handlePaymentStart = async (method: PaymentMethodConfig) => {
    if (isAnyMethodLoading) return;

    try {
      setActiveMethod(method.key);

      const response = await apiClient.post(method.endpoint, {
        bookingId,
        amount,
      });
      console.log("Payment initiation response:", response.data);

      const redirectUrl =
        response.data?.sessionUrl
 ?? response.data?.data?.sessionUrl
 ?? response.data?.data;

      if (!redirectUrl || typeof redirectUrl !== "string") {
        toast.error("Unable to start payment. Please try again.");
        setActiveMethod(null);
        return;
      }

      window.location.assign(redirectUrl);
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

      const message =
        messageFromApi || "Payment initialization failed.";
      toast.error(message);
      setActiveMethod(null);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 transition-opacity duration-200 ${
        isAnimatingIn ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
      role="presentation"
    >
      <div
        className={`w-full max-w-2xl rounded-2xl border border-white/50 bg-white p-6 shadow-2xl transition-all duration-200 sm:p-8 ${
          isAnimatingIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-method-modal-title"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2
              id="payment-method-modal-title"
              className="text-2xl font-bold text-slate-900"
            >
              Choose Your Payment Method
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Total payable amount: PKR {amount.toLocaleString()}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close payment method modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isLoading = activeMethod === method.key;

            return (
              <button
                key={method.key}
                type="button"
                onClick={() => handlePaymentStart(method)}
                disabled={isAnyMethodLoading}
                className={`flex w-full items-center justify-between cursor-pointer rounded-xl border p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 ${method.buttonClassName}`}
              >
                <span className="flex items-center gap-4">
                  <span className="rounded-lg bg-white/90 p-3 text-slate-800 shadow-sm">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block text-lg font-semibold text-slate-900">
                      {method.title}
                    </span>
                    <span className="block text-sm text-slate-600">
                      {method.subtitle}
                    </span>
                  </span>
                </span>

                {isLoading ? (
                  <ButtonSpinner />
                ) : (
                  <span className="text-sm font-medium text-slate-700">
                    Continue
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodModal;
