import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
        
                <Navbar />

      <div className="flex  flex-1 h-full mt-16">
              <Sidebar />

        <main className="pb-6 pt-8 px-7 flex-1 ml-44">{children}</main>
      </div>
    </div>
  );
}
