
import { useState, useRef, useEffect } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { logout } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";


export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
    const { user, setUser } = useAuth();
      const navigate = useNavigate();



  const handleLogout = async () => {
    try{
   await  logout();

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
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen]);

  return (
    <div className="flex justify-between items-center px-6 py-6 bg-[#eef6f5] border-b border-gray-300 fixed z-40 w-full">
      <div>     
        <h1 className="text-xl font-semibold">Logo Here</h1>
      </div>
      
      <div className="flex gap-5 items-center">
        <IoIosNotificationsOutline color="gray" className="w-5.5 h-5.5" />

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <img 
            src="/public/assets/profile.png" 
            alt="" 
            className="w-5.5 h-5.5 object-cover cursor-pointer" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition"
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
