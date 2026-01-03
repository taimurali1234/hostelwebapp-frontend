import { Search } from "lucide-react";
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}:SearchBarProps) {
  return (
    <div
      className={`flex items-center gap-2 w-full rounded-lg 
      bg-gray-100 border border-gray-300 
      px-4 py-2 ${className}`}
    >
      <Search size={18} className="text-gray-500" />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full bg-transparent outline-none 
          text-gray-700 placeholder-gray-500
        "
      />
    </div>
  );
}
