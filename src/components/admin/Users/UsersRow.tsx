import { Pencil, Trash2 } from "lucide-react";

export interface UserRowType {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "ADMIN" | "USER" | "COORDINATOR";
  isVerified: boolean;
}

interface UsersRowProps {
  user: UserRowType;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void; // optional (future use)
}

export function UsersRow({
  user,
  onEdit,
  onDelete,
}: UsersRowProps) {
  return (
    <tr className="border-b last:border-none">
      <td className="px-6 py-4">{user.name}</td>

      <td className="px-6 py-4 text-gray-600">{user.email}</td>

      <td className="px-6 py-4 text-gray-600">{user.phone}</td>

      <td className="px-6 py-4 text-gray-600">{user.role}</td>

      <td className="px-6 py-4">
        <span
          className={`text-sm font-medium ${
            user.isVerified
              ? "text-green-500"
              : "text-yellow-500"
          }`}
        >
          {user.isVerified ? "Verified" : "Unverified"}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex gap-4 text-gray-600">
          {/* Edit */}
          <Pencil
            size={18}
            className="cursor-pointer hover:text-black"
            onClick={() => onEdit(user.id)}

          />

          {/* Delete (optional) */}
            <Trash2
              size={18}
              className="cursor-pointer text-red-500"
              onClick={() => onDelete(user.id)}
            />
        </div>
      </td>
    </tr>
  );
}
