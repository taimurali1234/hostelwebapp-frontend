import clsx from "clsx";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
}

export default function Button({
  label,
  onClick,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const baseStyles =
    "px-6 py-3 rounded-lg font-medium transition-all duration-300";

  const variants = {
    primary:
      "bg-green-600 text-white hover:bg-green-700 shadow-lg",
    secondary:
      "bg-white text-gray-900 hover:bg-gray-100 border border-gray-200",
  };

  return (
    <button
      onClick={onClick}
      className={clsx(baseStyles, variants[variant], className)}
    >
      {label}
    </button>
  );
}
