import NotificationToast from "@/components/common/NotificationToast";
import type { BackendSeverity } from "@/types/notification.types";
import { toast } from "react-toastify";

interface NotificationPayload {
  title: string;
  message: string;
  severity: BackendSeverity;
}

export const showNotificationToast = (
  payload: NotificationPayload
) => {
  toast.info(
    <NotificationToast
      title={payload.title}
      message={payload.message}
      severity={payload.severity}
    />,
    {
      // 👇 override ONLY for notification toast
      autoClose: 5000,
      icon: false,
      closeButton: false,
      hideProgressBar: true,
      className: "bg-transparent shadow-none p-0"
    }
  );
};
