import Footer from "./Footer";
import UserNavbar from "./UserNavbar";
import OrderBanner from "../common/OrderBanner";
import { useLatestOrder } from "../../hooks/useLatestOrder";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { order, loading } = useLatestOrder();

  return (
    <div className="min-h-screen flex flex-col">
      <UserNavbar />
      <OrderBanner order={order} isLoading={loading} />
      <main className="pt-17 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
