import { useMemo, useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import UsersHeader from "../../components/admin/Users/UserHeader";
import { UsersFilters } from "../../components/admin/Users/UsersFilters";
import { UsersRow } from "../../components/admin/Users/UsersRow";
import { TableHeader } from "../../components/common/TableHeader";
import { TableCellLoader } from "../../components/common/Loader";
import { useDebounce } from "../../hooks/useDebounce";
import { useUsers } from "../../hooks/useUsersFetch";
import EditUserModal from "../../components/admin/Users/EditUserModel";
import type { EditUserForm } from "../../types/users.types";
import { useDeleteMutation, useUpdateMutation } from "../../hooks/useFetchApiQuerry";
import { toast } from "react-toastify";
import DeleteConfirmModal from "../../components/admin/Rooms/DeleteRoomModel";

interface UsersFiltersState {
  search: string;
  role: string;
  verified: string;
}

const columns = ["Name", "Email", "Phone", "Role", "Status", "Actions"];

export default function Users() {
  const [filters, setFilters] = useState<UsersFiltersState>({
    search: "",
    role: "",
    verified: "",
  });

  const [page, setPage] = useState(1);
  const limit = 10;

  const [editOpen, setEditOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
const [deleteUserId, setDeleteUserId] = useState<string | null>(null);


  const debouncedFilters = useDebounce(filters, 500);

  const queryFilters = useMemo(
    () => ({
      search: debouncedFilters.search,
      role: debouncedFilters.role,
      verified: debouncedFilters.verified,
      page,
      limit,
    }),
    [debouncedFilters, page]
  );

  const { data, isLoading, isFetching } = useUsers(queryFilters);

  const users = data?.items ?? [];
  const total = data?.total ?? 0;

  /* =====================
     UPDATE USER
  ====================== */

  const updateUserMutation = useUpdateMutation<EditUserForm>(
    "users",
    "/api/users",
    selectedUserId
  );

  const handleUpdateUser = (data: EditUserForm) => {
    updateUserMutation.mutate(data, {
      onSuccess: () => {
        toast.success("User updated successfully ✅");
        setEditOpen(false);
      },
      onError: (error: unknown) => {
      let message = "Failed to update user";

      if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    },
    });
  };

  const handleEdit = (id: string) => {
    console.log(id)
    setSelectedUserId(id);
    setEditOpen(true);
  };
const handleDeleteClick = (id: string) => {
  setDeleteUserId(id);
  setDeleteOpen(true);
};
  // Deleting the user

  const deleteUserMutation = useDeleteMutation(
  "users",
  "/api/users"
);


const handleConfirmDelete = () => {
  if (!deleteUserId) return;

  deleteUserMutation.mutate(deleteUserId, {
    onSuccess: () => {
      toast.success("User deleted successfully 🗑️");
      setDeleteOpen(false);
      setDeleteUserId(null);
    },
    onError: (error: unknown) => {
      let message = "Failed to delete user";
      if (error instanceof Error) message = error.message;
      toast.error(message);
    },
  });
};


  return (
    <AdminLayout>
      <div className="bg-surface">
        <UsersHeader />

        <h2 className="text-lg font-semibold mb-2">
          Showing {total} users
        </h2>

        <UsersFilters
          filters={filters}
          onChange={(key, value) =>
            setFilters((prev) => ({ ...prev, [key]: value }))
          }
          onClear={() =>
            setFilters({ search: "", role: "", verified: "" })
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <TableHeader columns={columns} />

            <tbody>
              {isLoading || isFetching ? (
                <TableCellLoader colSpan={6} text="Loading users..." />
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <UsersRow
                    key={user.id}
                    user={user}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-600">
            Page {page} of {Math.ceil(total / limit)}
          </span>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <button
              disabled={page * limit >= total}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* 🔥 Edit User Modal */}
        <EditUserModal
          open={editOpen}
          userId={selectedUserId}
          onClose={() => {
            setEditOpen(false);
            setSelectedUserId(null);
          }}
          onUpdate={handleUpdateUser}
        />
        <DeleteConfirmModal
  open={deleteOpen}
  onClose={() => {
    setDeleteOpen(false);
    setDeleteUserId(null);
  }}
  onConfirm={handleConfirmDelete}
  loading={deleteUserMutation.isPending}
  title="Delete User"
  description="Are you sure you want to delete this user? This action cannot be undone."
/>
      </div>
    </AdminLayout>
  );
}