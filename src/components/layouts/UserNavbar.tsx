import { useEffect, useRef, useState } from "react";
import { Bell, User, LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";
import { useAuth } from "../../context/AuthContext";

interface Notification {
  id: string;
  title: string;
  read: boolean;
}

export default function UserNavbar() {
  const { user, setUser } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", title: "New booking received", read: false },
    { id: "2", title: "Room price updated", read: false },
  ]);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  /* -----------------------------
     Close dropdown on outside click
  ------------------------------ */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* -----------------------------
     Mark notifications as read
  ------------------------------ */
  const openNotifications = () => {
    setShowNotifications((p) => !p);
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#f3f7f4] border-b border-green-100">
      <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold text-green-700">
          Hostel
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink label="Home" />
          <NavLink label="Rooms" />
          <NavLink label="About" />
          <NavLink label="Contact" />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={openNotifications}
              className="relative p-2 rounded-full hover:bg-green-100 transition"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500">
                      No notifications
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 text-sm border-b last:border-none
                          ${n.read ? "bg-gray-50" : "bg-green-50"}`}
                      >
                        {n.title}
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile((p) => !p)}
              className="p-2 rounded-full hover:bg-green-100 transition"
            >
              <User size={20} />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg"
                >
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium">
                      {user?.name}
                    </p>
                  </div>

                  <button
                    onClick={() => { setUser(null);}}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sign In (only if logged out) */}
          {!user && (
            <Button
              label="Sign In"
              className="bg-green-600 text-white hover:bg-green-700"
            />
          )}

          {/* Mobile Menu */}
          <button
            onClick={() => setMobileMenu((p) => !p)}
            className="md:hidden p-2 rounded-lg hover:bg-green-100"
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="md:hidden bg-[#f3f7f4] border-t"
          >
            <div className="flex flex-col px-6 py-4 gap-3">
              <NavLink label="Home" />
              <NavLink label="Rooms" />
              <NavLink label="About" />
              <NavLink label="Contact" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* -----------------------
   Helper Component
------------------------ */
function NavLink({ label }: { label: string }) {
  return (
    <span className="text-sm font-medium text-gray-700 hover:text-green-600 cursor-pointer">
      {label}
    </span>
  );
}
