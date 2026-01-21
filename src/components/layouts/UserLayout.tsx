import Footer from "./Footer";
import UserNavbar from "./UserNavbar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen  flex flex-col">
      <UserNavbar />
      <main className="pt-[72px]  flex-1">{children}</main>
      <Footer />
    </div>
  );
}
