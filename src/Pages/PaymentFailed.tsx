import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50 px-4 py-12">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-2xl items-center justify-center">
        <div className="w-full rounded-2xl border border-rose-100 bg-white p-8 shadow-xl sm:p-10">
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100">
              <AlertTriangle className="h-11 w-11 text-rose-600" />
            </div>
            <h1 className="text-3xl font-bold text-rose-800">
              Payment Failed ❌
            </h1>
            <p className="mt-3 text-base text-rose-700/80">
              Something went wrong with your payment.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 font-semibold text-white transition hover:bg-rose-700"
            >
              <RotateCcw className="h-4 w-4" />
              Retry Payment
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-5 py-3 font-semibold text-rose-700 transition hover:bg-rose-50"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
