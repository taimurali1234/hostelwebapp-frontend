import { CheckCircle2, Home } from "lucide-react";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { sessionId, bookingId } = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return {
      sessionId: searchParams.get("session_id"),
      bookingId: searchParams.get("bookingId"),
    };
  }, [location.search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50 px-4 py-12">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-2xl items-center justify-center">
        <div className="w-full rounded-2xl border border-emerald-100 bg-white p-8 shadow-xl sm:p-10">
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-11 w-11 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-emerald-800">
              Payment Successful 🎉
            </h1>
            <p className="mt-3 text-base text-emerald-700/80">
              Your booking has been confirmed.
            </p>
          </div>

          <div className="mt-8 space-y-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
            <p>
              <span className="font-semibold">Session ID:</span>{" "}
              {sessionId || "Not provided"}
            </p>
            {bookingId && (
              <p>
                <span className="font-semibold">Booking ID:</span> {bookingId}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
