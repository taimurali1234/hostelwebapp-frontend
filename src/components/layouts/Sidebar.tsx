import {
  Home,
  Bed,
  BookOpen,
  Star,
  DollarSign,
  Users,
  BarChart,
  Bell,
  Tag,
  ShoppingCart,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menu = [
  { icon: Home, path: "/admin/dashboard", label: "Dashboard" },
  { icon: Bed, path: "/admin/rooms", label: "Rooms" },
  { icon: Tag, path: "/admin/room-pricing", label: "Room Pricing" },
  { icon: ShoppingCart, path: "/admin/orders", label: "Orders" },
  { icon: BookOpen, path: "/admin/bookings", label: "Bookings" },
  { icon: Star, path: "/admin/reviews", label: "Reviews" },
  { icon: Bell, path: "/admin/notifications", label: "Notifications" },
  { icon: DollarSign, path: "/admin/payments", label: "Payments" },
  { icon: Users, path: "/admin/users", label: "Users" },
  { icon: BarChart, path: "/admin/analytics", label: "Analytics" },
];

export default function Sidebar() {
  return (
    <aside className="w-44 bg-[#eef6f5] px-4 py-6 border-r border-gray-300 
      h-[calc(100vh-4rem)] overflow-y-auto thin-scrollbar fixed z-20"
    >
      <nav className="space-y-6">
        {menu.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg cursor-pointer text-sm
               ${
                 isActive
                   ? "bg-white text-textPrimary"
                   : "text-textSecondary hover:bg-white hover:text-textPrimary"
               }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
