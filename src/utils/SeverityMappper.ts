import type { BackendSeverity, ToastSeverity } from "@/types/notification.types";

export const mapBackendSeverityToToast = (
  severity: BackendSeverity
): ToastSeverity => {
  switch (severity) {
    case "ERROR":
      return "ERROR";
    case "WARNING":
      return "WARNING";
    case "SUCCESS":
      return "SUCCESS";
    case "INFO":
    default:
      return "INFO";
  }
};
