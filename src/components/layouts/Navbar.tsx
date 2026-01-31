
import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { logout } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "@/context/NotificationContext";
import { disconnectSocket } from "@/services/socket";


export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const {
      notifications,
      markAsRead,
      markAllAsRead,
      reloadNotifications
    } = useNotifications();

    // show only ADMIN and ALL_USERS notifications (exclude USER audience)
const adminNotifications = notifications.filter((n) => n.audience === "ADMIN" || n.audience === "ALL_USERS");
const adminUnreadCount = adminNotifications.filter((n) => !n.isRead).length; 
  

  const handleLogout = async () => {
    try{
   await  logout();
   disconnectSocket();

    }
    catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);               // frontend: clear user + localStorage
      navigate("/login");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    if (isDropdownOpen || showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen, showNotifications]);

  const handleMarkAsRead = async (id: string) => {
  const notif = notifications.find((n) => n.id === id);
  if (notif?.isRead) return;

  setShowNotifications(false);
  await markAsRead(id);
};

const handleMarkAllAsRead = async () => {
  try {
    await markAllAsRead();
    // ✅ Reload from backend to verify persistence
    await reloadNotifications();
  } catch (err) {
    console.error("Failed to mark all as read:", err);
  }
};


  return (
    <div className="flex justify-between items-center px-6 py-6 bg-[#eef6f5] border-b border-gray-300 fixed z-40 w-full">
      <div>     
        <h1 className="text-xl font-semibold">Logo Here</h1>
      </div>
      
      <div className="flex gap-5 items-center">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications((p) => !p);
              setIsDropdownOpen(false);
            }}
            className="relative p-2 rounded-full cursor-pointer hover:bg-green-100"
          >
            <Bell size={20} />
           {adminUnreadCount > 0 && (
  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
    {adminUnreadCount}
  </span>
)}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-xl border overflow-hidden z-50"
              >
                <div className="px-4 py-3 flex items-center justify-between font-semibold border-b bg-gray-50">
                  <span>Notifications</span>
                   {adminUnreadCount  > 0 && (
    <button
      onClick={handleMarkAllAsRead}
      className="text-xs text-green-600 hover:underline"
    >
      Mark all as read
    </button>
  )}
                </div>

                <div className="max-h-[60vh] overflow-y-auto">
                  {adminNotifications.filter(n => !n.isRead).length > 0 ? (
                    adminNotifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleMarkAsRead(n.id)}
                        className={`flex gap-3 px-4 py-3 items-start border-b last:border-none cursor-pointer transition
                          ${n.isRead ? "bg-white hover:bg-gray-50" : "bg-green-50 hover:bg-green-100"}
                        `}
                      >
                        <div className="shrink-0 mt-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${n.isRead ? "bg-gray-200 text-gray-700" : "bg-green-600 text-white"}`}>
                            {n.title?.[0] ?? "N"}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <div className="font-semibold text-gray-900 truncate">{n.title}</div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                              n.isRead 
                                ? "bg-gray-300 text-gray-700" 
                                : "bg-green-600 text-white"
                            }`}>
                              {n.isRead ? "READ" : "UNREAD"}
                            </span>
                          </div>

                          <div className="text-sm text-gray-600 mt-1 truncate">{n.message}</div>
                          <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-sm text-gray-600">
                      No new notification till yet
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        
        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <img 
            src="/public/assets/profile.png" 
            alt="" 
            className="w-5.5 h-5.5 object-cover cursor-pointer" 
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
              setShowNotifications(false);
            }}
          />

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-800">{user?.name || "User"}</p>
                <p className="text-xs text-gray-600">{user?.email || "user@example.com"}</p>
              </div>

              <div className="py-2">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
