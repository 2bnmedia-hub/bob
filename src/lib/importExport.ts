import Papa from "papaparse";
import * as XLSX from "xlsx";

export type ImportProductRow = {
  name: string;
  price: number;
  old_price?: number;
  stock?: number;
  sku?: string;
  category_name?: string;
  image_url?: string;
  description?: string;
};

export type ImportCategoryRow = {
  name: string;
  image_url?: string;
};

const PRODUCT_HEADERS = ["name", "price", "old_price", "stock", "sku", "category_name", "image_url", "description"];
const CATEGORY_HEADERS = ["name", "image_url"];

export function parseFile(file: File): Promise<Record<string, any>[]> {
  return new Promise((resolve, reject) => {
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "json") {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string);
          resolve(Array.isArray(data) ? data : [data]);
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
      return;
    }

    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => resolve(results.data as Record<string, any>[]),
        error: reject,
      });
      return;
    }

    if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(sheet);
          resolve(json as Record<string, any>[]);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
      return;
    }

    reject(new Error("פורמט קובץ לא נתמך. השתמשו ב-CSV, Excel או JSON."));
  });
}

export function downloadProductTemplate(format: "csv" | "xlsx" | "json") {
  const sample = [
    { name: "מקדחה אלחוטית 18V", price: 349, old_price: 429, stock: 20, sku: "DRL-001", category_name: "כלי עבודה", image_url: "", description: "מקדחה מקצועית נטענת" },
  ];
  downloadData(sample, PRODUCT_HEADERS, format, "תבנית_מוצרים");
}

export function downloadCategoryTemplate(format: "csv" | "xlsx" | "json") {
  const sample = [{ name: "כלי עבודה", image_url: "" }];
  downloadData(sample, CATEGORY_HEADERS, format, "תבנית_קטגוריות");
}

export function exportProducts(rows: ImportProductRow[], format: "csv" | "xlsx" | "json") {
  downloadData(rows, PRODUCT_HEADERS, format, "מוצרים_export");
}

export function exportCategories(rows: ImportCategoryRow[], format: "csv" | "xlsx" | "json") {
  downloadData(rows, CATEGORY_HEADERS, format, "קטגוריות_export");
}

function downloadData(rows: Record<string, any>[], headers: string[], format: "csv" | "xlsx" | "json", filename: string) {
  if (format === "json") {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" });
    triggerDownload(blob, filename + ".json");
    return;
  }
  if (format === "csv") {
    const csv = Papa.unparse(rows, { columns: headers });
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    triggerDownload(blob, filename + ".csv");
    return;
  }
  const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const buffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  triggerDownload(blob, filename + ".xlsx");
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
