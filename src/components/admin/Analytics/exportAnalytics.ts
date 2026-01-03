import Papa from "papaparse";
import { saveAs } from "file-saver";

export function exportAnalyticsCSV<T extends Record<string, unknown>>(
  data: T[],
  fileName = "analytics-report.csv"
) {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  saveAs(blob, fileName);
}
