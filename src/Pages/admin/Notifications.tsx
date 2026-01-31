import { useMemo, useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import NotificationsHeader from "../../components/admin/Notifications/NotificationHeader";
import { NotificationsFilters } from "../../components/admin/Notifications/NotificationFilter";
import {
  NotificationsRow,
} from "../../components/admin/Notifications/NotificationRow";
import { TableHeader } from "../../components/common/TableHeader";
import { TableCellLoader } from "../../components/common/Loader";
import { useDebounce } from "../../hooks/useDebounce";
import { useNotifications } from "../../hooks/useNotificationsFetch";
import {
  useCreateNotification,
  useUpdateNotification,
  useDeleteNotification,
} from "../../hooks/useNotificationMutations";
import AddNotificationModal, {
  type CreateNotificationForm,
} from "../../components/admin/Notifications/AddNotificationModel";
import { toast } from "react-toastify";
import DeleteConfirmModal from "../../components/admin/Rooms/DeleteRoomModel";
import { useDeleteMutation, useUpdateMutation } from "../../hooks/useFetchApiQuerry";

interface NotificationsFiltersState {
  search: string;
  audience: string;
  severity: string;
  read: string;
}

const columns = [
  "Title",
  "Message",
  "Audience",
  "Severity",
  "Status",
  "Date",
  "Actions",
];

export default function Notifications() {
  const [filters, setFilters] =
    useState<NotificationsFiltersState>({
      search: "",
      audience: "",
      severity: "",
      read: "",
    });

  const [page, setPage] = useState(1);
  const limit = 10;

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    string | null
  >(null);
  const [selectedNotification, setSelectedNotification] = useState<
    (CreateNotificationForm & { id: string }) | undefined
  >(undefined);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteNotificationId, setDeleteNotificationId] = useState<
    string | null
  >(null);

  const debouncedFilters = useDebounce(filters, 500);

  const queryFilters = useMemo(
    () => ({
      search: debouncedFilters.search,
      audience: debouncedFilters.audience,
      severity: debouncedFilters.severity,
      read: debouncedFilters.read,
      page,
      limit,
    }),
    [debouncedFilters, page]
  );

  const { data, isLoading } = useNotifications(queryFilters);
  console.log("Notifications data:", data);
  const createMutation = useCreateNotification();
  const updateMutation = useUpdateMutation(
    "notifications", "/notifications", selectedNotificationId
  );
  const deleteMutation = useDeleteMutation(
    "notifications", "/notifications"
  );

  const notifications = data?.items ?? [];
  console.log("Notifications list:", notifications);  
  const total = data?.total ?? 0;

  const handleCreateSubmit = (formData: CreateNotificationForm) => {
    createMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Notification created successfully! 📧");
        setCreateModalOpen(false);
      },
      onError: (error: unknown) => {
        let message = "Failed to create notification";
        if (error instanceof Error) message = error.message;
        toast.error(message);
      },
    });
  };

  /* =====================
     EDIT NOTIFICATION
  ====================== */
  const handleEdit = (id: string) => {
    console.log(id)
    const notification = notifications.find((n) => n.id === id);
      setSelectedNotificationId(id); // ✅ FIX

    if (notification && notification.id) {
      setSelectedNotification({
        ...notification,
        id: notification.id,
        audience: notification.audience === "ALL" ? "ALL_USERS" : notification.audience,
      });
      setEditModalOpen(true);
    }
  };

  const handleUpdateNotification = (data: CreateNotificationForm & { id: string }) => {
      updateMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Notification updated successfully ✅");
          setEditModalOpen(false);
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
  /* =====================
     DELETE NOTIFICATION
  ====================== */

  const handleDelete = (id: string) => {
    setDeleteNotificationId(id);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteNotificationId) return;

    deleteMutation.mutate(deleteNotificationId, {
      onSuccess: () => {
        toast.success("Notification deleted successfully 🗑️");
        setDeleteOpen(false);
        setDeleteNotificationId(null);
      },
      onError: (error: unknown) => {
        let message = "Failed to delete notification";
        if (error instanceof Error) message = error.message;
        toast.error(message);
      },
    });
  };

  return (
    <AdminLayout>
      <div className="bg-surface">
        <NotificationsHeader  />

        <h2 className="text-lg font-semibold mb-2">
          Showing {total} notifications
        </h2>

        <NotificationsFilters
          filters={filters}
          onChange={(k, v) => {
            setFilters((p) => ({ ...p, [k]: v }));
            setPage(1);
          }}
          onClear={() => {
            setFilters({
              search: "",
              audience: "",
              severity: "",
              read: "",
            });
            setPage(1);
          }}
        />

        <div className="overflow-x-auto max-h-[250px] overflow-y-auto  rounded-lg">
          <table className="w-full text-sm">
            <TableHeader columns={columns} />
            <tbody>
              {isLoading ? (
                <TableCellLoader
                  colSpan={7}
                  text="Loading notifications..."
                />
              ) : notifications.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-6 text-gray-500"
                  >
                    No notifications found
                  </td>
                </tr>
              ) : (
                notifications.map((n, idx) => (
                  <NotificationsRow
                    key={n.id || `notification-${idx}`}
                    notification={n}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
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
      </div>

      {/* Create/Edit Modal */}
      <AddNotificationModal
        open={createModalOpen || editModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setEditModalOpen(false);
          setSelectedNotification(undefined);
          setSelectedNotificationId(null);
        }}
        onSubmit={(data) => {
          if (editModalOpen && selectedNotification?.id) {
            handleUpdateNotification({ ...data, id: selectedNotification.id });
          } else {
            handleCreateSubmit(data);
          }
        }}
        loading={
          editModalOpen
            ? updateMutation.isPending
            : createMutation.isPending
        }
        notification={selectedNotification}
        isEdit={editModalOpen}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteNotificationId(null);
        }}
        onConfirm={handleConfirmDelete}
        loading={deleteMutation.isPending}
        title="Delete Notification"
        description="Are you sure you want to delete this notification? This action cannot be undone."
      />
    </AdminLayout>
  );
}
