interface TableCellLoaderProps {
  colSpan: number;
  height?: number;
  text?: string;
}

export function TableCellLoader({
  colSpan,
  height = 4,
  text = "Loading...",
}: TableCellLoaderProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-6">
        <div
          className="relative w-full bg-gray-200 rounded animate-pulse
          flex items-center justify-center"
          style={{ height: `${height}rem` }}
        >
          <span className="text-sm text-gray-500 font-medium">
            {text}
          </span>
        </div>
      </td>
    </tr>
  );
}
