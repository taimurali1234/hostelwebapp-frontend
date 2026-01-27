import { useEffect, useRef, useState } from "react";
import {
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ShoppingCart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";
import { useAuth } from "../../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router";
import { logout } from "../../services/authService";
import { useBooking } from "@/context/BookingContext";

interface Notification {
  id: string;
  title: string;
  read: boolean;
}

export default function UserNavbar() {
  const { user, setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems = [] } = useBooking();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", title: "New booking received", read: false },
    { id: "2", title: "Room price updated", read: false },
  ]);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  /* -------------------- CLICK OUTSIDE LOGIC -------------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (notifRef.current && !notifRef.current.contains(target)) {
        setShowNotifications(false);
      }

      if (profileRef.current && !profileRef.current.contains(target)) {
        setShowProfile(false);
      }

      if (cartRef.current && !cartRef.current.contains(target)) {
        setShowCart(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* -------------------- LOGOUT -------------------- */
  const handleLogout = async () => {
    try {
      await logout();
      setShowProfile(false);
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
      navigate("/login");
    }
  };

  const openNotifications = () => {
    setShowNotifications((p) => !p);
    setShowCart(false);
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const navLinkClass = (path: string) =>
    `text-sm font-medium transition cursor-pointer ${
      location.pathname === path
        ? "text-green-700"
        : "text-gray-700 hover:text-green-700"
    }`;

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#f3f7f4] border-b border-green-100">
      <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">

        {/* Logo */}
        <div className="text-xl font-bold text-green-700 cursor-pointer">
          Hostel
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={navLinkClass("/")}>Home</Link>
          <Link to="/rooms" className={navLinkClass("/rooms")}>Rooms</Link>
          <Link to="/about" className={navLinkClass("/about")}>About</Link>
          <Link to="/contact" className={navLinkClass("/contact")}>Contact</Link>
          <Link to="/privacy" className={navLinkClass("/privacy")}>Policy</Link>
          <Link to="/terms" className={navLinkClass("/terms")}>Terms</Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={openNotifications}
              className="relative p-2 rounded-full cursor-pointer hover:bg-green-100"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
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
                  className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border overflow-hidden"
                >
                  <div className="px-4 py-3 font-semibold border-b">
                    Notifications
                  </div>

                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="px-4 py-3 text-sm border-b last:border-none hover:bg-green-100 cursor-pointer"
                    >
                      {n.title}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart */}
          <div className="relative" ref={cartRef}>
            <button
              onClick={() => {
                setShowCart((p) => !p);
                setShowProfile(false);
                setShowNotifications(false);
              }}
              className="relative p-2 rounded-full cursor-pointer hover:bg-green-100"
            >
              <ShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showCart && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border p-3"
                >
                  {cartItems.length === 0 ? (
                    <div className="py-8 text-center">
                      <ShoppingCart
                        className="mx-auto text-gray-300 mb-3"
                        size={40}
                      />
                      <p className="text-sm text-gray-500">
                        Your cart is empty
                      </p>
                      <Link
                        to="/rooms"
                        onClick={() => setShowCart(false)}
                        className="inline-block mt-3 text-green-600 text-sm font-semibold hover:underline"
                      >
                        Browse Rooms
                      </Link>
                    </div>
                  ) : (
                    <>
                      {cartItems.slice(0, 2).map((b, i) => (
                        <div
                          key={i}
                          className="flex gap-3 border-b pb-2 mb-2"
                        >
                          <img
                            src={
                              b.image?.url ||
                              "https://via.placeholder.com/150?text=No+Image"
                            }
                            className="w-16 h-16 rounded object-cover"
                          />
                          <div>
                            <p className="font-semibold text-sm">
                              {b.room.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {b.stayType}
                            </p>
                            <p className="text-green-600 font-bold">
                              PKR {b.total}
                            </p>
                          </div>
                        </div>
                      ))}

                      <Link
                        to="/bookings"
                        onClick={() => setShowCart(false)}
                        className="block text-center text-gray-600 hover:text-green-600 font-semibold text-sm mt-2"
                      >
                        Show All Bookings
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setShowProfile((p) => !p);
                setShowCart(false);
              }}
              className="p-2 rounded-full cursor-pointer hover:bg-green-100"
            >
              <User size={20} />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-xl border"
                >
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium">{user?.name}</p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex cursor-pointer items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!user && (
            <Button
              label="Sign In"
              className="bg-green-600 text-white hover:bg-green-700"
            />
          )}

          {/* Mobile Toggle */}
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
            <div className="flex flex-col items-center px-6 py-6 gap-4">
              <Link to="/" className={navLinkClass("/")}>Home</Link>
              <Link to="/rooms" className={navLinkClass("/rooms")}>Rooms</Link>
              <Link to="/about" className={navLinkClass("/about")}>About</Link>
              <Link to="/contact" className={navLinkClass("/contact")}>Contact</Link>
              <Link to="/privacy" className={navLinkClass("/privacy")}>Privacy</Link>
              <Link to="/terms" className={navLinkClass("/terms")}>Terms</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
