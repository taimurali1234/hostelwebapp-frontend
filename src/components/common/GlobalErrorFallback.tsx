import { getErrorMessage, type FallbackProps } from "react-error-boundary";
import { useNavigate } from "react-router-dom";

function GlobalErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const navigate = useNavigate();
  const message = getErrorMessage(error) ?? "Unknown error";

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-rose-100 px-6 py-12">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-2xl items-center justify-center">
        <div className="w-full rounded-2xl border border-slate-200 bg-white/95 p-8 text-center shadow-xl backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-700">
            Unexpected Error
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Something went wrong
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            We hit an issue while rendering this page. You can retry, or go
            back to the home page.
          </p>
          <div className="mt-5 rounded-lg border border-rose-100 bg-rose-50 p-3 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-700">
              Error message
            </p>
            <p className="mt-1 break-words text-sm text-rose-900">
              {message}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={resetErrorBoundary}
              className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Retry
            </button>
            <button
              onClick={() => navigate("/")}
              className="rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GlobalErrorFallback;
