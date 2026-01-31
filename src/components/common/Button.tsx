import clsx from "clsx";
import { useNavigate } from "react-router-dom";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
  href?: string;
}

export default function Button({
  label,
  onClick,
  variant = "primary",
  className = "",
  href,
}: ButtonProps) {
  const navigate = useNavigate();
  const baseStyles =
    "px-6 py-3 rounded-lg font-medium transition-all duration-300 cursor-pointer";

  const variants = {
    primary:
      "bg-green-600 text-white hover:bg-green-700 shadow-lg",
    secondary:
      "bg-white text-gray-900 hover:bg-gray-100 border border-gray-200",
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      navigate(href);
    } else {
      // Auto-navigate based on label
      if (label === "Book a Room") {
        navigate("/bookings");
      } else if (label === "View Rooms") {
        navigate("/rooms");
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className={clsx(baseStyles, variants[variant], className)}
    >
      {label}
    </button>
  );
}
