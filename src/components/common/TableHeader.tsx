interface TableHeaderProps {
  columns: string[];
}

export function TableHeader({ columns }: TableHeaderProps) {
  return (
    <thead className="bg-[#F7F9FC] border-b border-gray-200">
      <tr>
        {columns.map((col) => (
          <th
            key={col}
            className="px-6 py-4 text-left text-sm font-medium text-gray-600"
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
}
