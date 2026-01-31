import { ChevronDown, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import type { OrderItem } from "../../types/order.types";
import { useEffect, useState } from "react";

interface OrderBannerProps {
  order?: OrderItem | null;
  isLoading?: boolean;
}

export default function OrderBanner({ order, isLoading }: OrderBannerProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showFullBanner, setShowFullBanner] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const isHomePage = location.pathname === "/";
  const isOrderDetailsPage = location.pathname.startsWith("/orders/");
  const isOrderHistoryPage = location.pathname === "/my-orders";
  const hasOrder = !!order;

  // Don't show banner on order details page or order history page
  if (isOrderHistoryPage) return null;

  useEffect(() => {
    if (isLoading) return;

    if (!hasOrder) {
      // No order - don't show anything
      setShowButton(false);
      setShowFullBanner(false);
      return;
    }

    // Has order
    if (isHomePage) {
      // Homepage: show full banner immediately
      setShowFullBanner(true);
      setShowButton(false);

      // After 4 seconds, collapse to button
      const timer = setTimeout(() => {
        setShowFullBanner(false);
        setShowButton(true);
      }, 4000);

      return () => clearTimeout(timer);
    } else {
      // Other pages: show button only
      setShowFullBanner(false);
      setShowButton(true);
    }
  }, [hasOrder, isHomePage, isLoading]);

  const statusColors: Record<string, { bg: string; text: string; icon: string }> = {
    PENDING: { bg: "bg-yellow-50", text: "text-yellow-800", icon: "⏳" },
    RESERVED: { bg: "bg-blue-50", text: "text-blue-800", icon: "🔒" },
    CONFIRMED: { bg: "bg-green-50", text: "text-green-800", icon: "✅" },
    COMPLETED: { bg: "bg-emerald-50", text: "text-emerald-800", icon: "🎉" },
    CANCELLED: { bg: "bg-red-50", text: "text-red-800", icon: "❌" },
  };

  const statusColor = statusColors[order?.status || "PENDING"] || statusColors.PENDING;

  // Full Banner View - WITH ORDER
  if (showFullBanner && hasOrder) {
    return (
      <div className="fixed top-0 left-0 right-0 z-60" style={{ animation: "slideDown 0.6s ease-out forwards" }}>
        <style>{`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-100%);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
        <div className={`${statusColor.bg} border-b-2 border-opacity-20 shadow-lg`}>
          <div className="max-w-7xl mx-auto">
            <div className="px-4 py-4 md:px-6 md:py-5">
              <div className="flex items-center justify-between gap-4">
                {/* Left: Order Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="shrink-0 text-2xl">{statusColor.icon}</div>
                  <div className="min-w-0 flex-1">
                    <h3 className={`${statusColor.text} font-bold text-sm md:text-base truncate`}>
                      Order {order?.orderNumber}
                    </h3>
                    <p className={`${statusColor.text} text-xs md:text-sm opacity-75 truncate`}>
                      {order?.user?.name} • PKR {order?.totalAmount?.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigate("/my-orders")}
                    className={`px-3 md:px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:shadow-md active:scale-95 bg-white ${statusColor.text} border border-current cursor-pointer`}
                  >
                    View Order History
                  </button>

                  <button
                    onClick={() => {
                      setShowFullBanner(false);
                      setShowButton(true);
                    }}
                    className={`p-2 rounded-lg transition-all ${statusColor.text} hover:bg-white/50 cursor-pointer`}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Collapsed Button View - WITH ORDER
  if (showButton && hasOrder) {
    return (
      <div className="fixed top-20 right-4 z-40 animate-fade-in">
        <button
          onClick={() => {
            setShowButton(false);
            setShowFullBanner(true);
          }}
          className={`${statusColor.bg} ${statusColor.text} border-2 border-current rounded-lg px-4 py-3 font-semibold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap cursor-pointer`}
        >
          <span className="text-lg">{statusColor.icon}</span>
          View Order History
          <ChevronDown size={18} />
        </button>
      </div>
    );
  }



  return null;
}
