import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { EditUserForm } from "../../../types/users.types";
import { useSingleQuery } from "../../../hooks/useFetchApiQuerry";
import { updateUserSchema } from "../../../Zod Validation/users/users.dtos";
import { toast } from "react-toastify";

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  userId: string | null;
  onUpdate: (data: EditUserForm) => void;
}


type SingleUserApiResponse = EditUserForm;


export default function EditUserModal({
  open,
  onClose,
  userId,
  onUpdate,
}: EditUserModalProps) {
  const [form, setForm] = useState<EditUserForm | null>(null);
  const [errors, setErrors] = useState<
  Partial<Record<keyof EditUserForm, string[]>>
>({});

  // 🔥 fetch single user
  const { data, isLoading } = useSingleQuery<SingleUserApiResponse>(
    "user",
    userId,
    "/api/users",
    open
  );
  console.log(data)

  useEffect(() => {
    if (open && data) {
      setForm({
        name: data.name ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      address: data.address ?? "",          // ✅ fallback
      role: data.role ?? "USER",             // ✅ fallback
      isVerified: data.isVerified ?? false,
      });
    }
  }, [open, data]);

  if (!open) return null;
  if (isLoading || !form) return null;

  const handleChange = (
    key: keyof EditUserForm,
    value: string | boolean
  ) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    setErrors((prev) => {
    const copy = { ...prev };
    delete copy[key];
    return copy;
  });
  };

  const handleSubmit = () => {
  if (!form) return;

  const result = updateUserSchema.safeParse(form);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    setErrors(fieldErrors);

    // 🔥 Toast: show first error only
    const firstError =
      result.error.issues[0]?.message || "Validation error";

    toast.error(firstError);

    return;
  }

  setErrors({}); // ✅ clear errors
  onUpdate(form);
};

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Edit User</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        {/* Name */}
        <input
  className={`w-full border rounded-lg px-4 py-2 ${
    errors.name ? "border-red-500" : ""
  }`}
  value={form.name}
  onChange={(e) => handleChange("name", e.target.value)}
  placeholder="Full Name"
/>

{errors.name && (
  <p className="text-red-500 text-xs ">
    {errors.name[0]}
  </p>
)}


        {/* Email */}
        <input
  className={`w-full border rounded-lg px-4 py-2 ${
    errors.email ? "border-red-500" : ""
  }`}
  value={form.email}
  onChange={(e) => handleChange("email", e.target.value)}
  placeholder="Email"
/>

{errors.email && (
  <p className="text-red-500 text-xs mt-1">
    {errors.email[0]}
  </p>
)}


        {/* Phone */}
        <input
  className={`w-full border rounded-lg px-4 py-2 ${
    errors.phone ? "border-red-500" : ""
  }`}
  value={form.phone}
  onChange={(e) => handleChange("phone", e.target.value)}
  placeholder="Phone"
/>

{errors.phone && (
  <p className="text-red-500 text-xs ">
    {errors.phone[0]}
  </p>
)}


        {/* Address */}
       <input
  className={`w-full border rounded-lg px-4 py-2 ${
    errors.address ? "border-red-500" : ""
  }`}
  value={form.address}
  onChange={(e) => handleChange("address", e.target.value)}
  placeholder="Address"
/>

{errors.address && (
  <p className="text-red-500 text-xs ">
    {errors.address[0]}
  </p>
)}


        {/* Role */}
        <select
  className={`w-full border rounded-lg px-4 py-2 ${
    errors.role ? "border-red-500" : ""
  }`}
  value={form.role}
  onChange={(e) =>
    handleChange("role", e.target.value as EditUserForm["role"])
  }
>
  <option value="USER">User</option>
  <option value="ADMIN">Admin</option>
  <option value="COORDINATOR">Coordinator</option>
</select>

{errors.role && (
  <p className="text-red-500 text-xs ">
    {errors.role[0]}
  </p>
)}

        {/* Verified */}
        <select
  className={`w-full border rounded-lg px-4 py-2 ${
    errors.isVerified ? "border-red-500" : ""
  }`}
  value={String(form.isVerified)}
  onChange={(e) =>
    handleChange("isVerified", e.target.value === "true")
  }
>
  <option value="true">Verified</option>
  <option value="false">Unverified</option>
</select>

{errors.isVerified && (
  <p className="text-red-500 text-xs">
    {errors.isVerified[0]}
  </p>
)}

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
            Update User
          </button>
        </div>
      </div>
    </div>
  );
}
