import { X } from "lucide-react";
import { useEffect, useState } from "react";

export interface CreateUserForm {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: "ADMIN" | "USER" |"COORDINATOR";
}

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserForm) => void;
}

const initialState: CreateUserForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  role: "USER",
};

export default function AddUserModal({
  open,
  onClose,
  onSubmit,
}: AddUserModalProps) {
  const [form, setForm] = useState<CreateUserForm>(initialState);
  useEffect(() => {
    if (!open) setForm(initialState);
  }, [open]);

  if (!open) return null;


  const handleChange = (
    key: keyof CreateUserForm,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmit(form);
    // onClose();
    // setForm(initialState);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Add User</h2>
          <X
            className="cursor-pointer text-gray-500"
            onClick={onClose}
          />
        </div>

        <input
          name="new user name"
          autoComplete="new user name"
          className="w-full border rounded-lg px-4 py-2"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <input
          className="w-full border rounded-lg px-4 py-2"
          placeholder="Email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />

        <input
          type="password"
          className="w-full border rounded-lg px-4 py-2"
          placeholder="Password"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
        />

        <input
          className="w-full border rounded-lg px-4 py-2"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />

        <input
          className="w-full border rounded-lg px-4 py-2"
          placeholder="Address"
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />

        <select
          className="w-full border rounded-lg px-4 py-2"
          value={form.role}
          onChange={(e) => handleChange("role", e.target.value)}
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="COORDINATOR">Coordinator</option>
        </select>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Create User
          </button>
        </div>
      </div>
    </div>
  );
}
