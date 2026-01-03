import { Search, X, Plus } from "lucide-react";
import { useState } from "react";
import AddUserModal, { type CreateUserForm } from "./AddUsersModel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export interface UsersFiltersProps {
  filters: {
    search: string;
    role: string;
    verified: string;
  };
  onChange: (
    key: "search" | "role" | "verified",
    value: string
  ) => void;
  onClear: () => void;
}

export function UsersFilters({
  filters,
  onChange,
  onClear,
}: UsersFiltersProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  /* =========================
     CREATE USER MUTATION
  ========================== */

  const createUserMutation = useMutation({
    mutationFn: async (data: CreateUserForm) => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      return result;
    },

    onSuccess: () => {
      toast.success("User created successfully 🎉");

      // 🔥 refresh users list (same as rooms)
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setOpen(false);
    },

    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create user");
      }
    },
  });

  const handleCreateUser = (data: CreateUserForm) => {
    createUserMutation.mutate(data);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg border">
            <Search size={18} className="text-gray-500" />
            <input
              name="search user name"
              placeholder="Search by name or email..."
              value={filters.search}
              autoComplete="off"
              onChange={(e) => onChange("search", e.target.value)}
              className="bg-transparent outline-none text-sm w-64"
            />
          </div>

          {/* Role */}
          <select
            value={filters.role}
            onChange={(e) => onChange("role", e.target.value)}
            className="bg-gray-100 px-4 py-2 rounded-lg border text-sm"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
            <option value="COORDINATOR">Coordinator</option>
          </select>

          {/* Verified */}
          <select
            value={filters.verified}
            onChange={(e) => onChange("verified", e.target.value)}
            className="bg-gray-100 px-4 py-2 rounded-lg border text-sm"
          >
            <option value="">All Status</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>

          {/* Clear */}
          <button
            onClick={onClear}
            className="flex items-center gap-2 px-4 py-2 text-sm 
            bg-white border rounded-lg hover:bg-gray-100"
          >
            <X size={16} />
            Clear Filters
          </button>
        </div>

        {/* Add User */}
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm 
          bg-white border rounded-lg hover:bg-gray-100"
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      <AddUserModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreateUser}
      />
    </>
  );
}
