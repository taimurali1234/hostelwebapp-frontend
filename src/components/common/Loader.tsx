interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

interface TableCellLoaderProps {
  colSpan: number;
  height?: number;
  text?: string;
}

/**
 * Beautiful full-screen or inline loader component
 */
export default function Loader({
  size = "md",
  text = "Loading...",
  fullScreen = true,
}: LoaderProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Spinner */}
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 animate-spin"></div>
      </div>

      {/* Text */}
      {text && (
        <p className="text-gray-600 font-medium text-center">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {loaderContent}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-8">{loaderContent}</div>;
}

/**
 * Table cell loader for skeleton loading in tables
 */
export function TableCellLoader({
  colSpan,
  height = 4,
  text = "Loading...",
}: TableCellLoaderProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-6">
        <div
          className="relative w-full bg-linear-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse flex items-center justify-center overflow-hidden"
          style={{ height: `${height}rem` }}
        >
          <span className="text-sm text-gray-500 font-medium">{text}</span>
        </div>
      </td>
    </tr>
  );
}
