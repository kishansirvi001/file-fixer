import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { createXlsx, extractPdfRows, loadPdf } from "@/lib/pdfTools";

export default function PdfToExcel() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const convert = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const pages = await extractPdfRows(await loadPdf(file));
      const workbook = await createXlsx(pages);
      const url = URL.createObjectURL(workbook);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${file.name.replace(/\.pdf$/i, "")}.xlsx`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      alert(error.message || "Could not extract this PDF.");
    } finally {
      setLoading(false);
    }
  };

  return <ToolLayout title="PDF to Excel Converter">
    <div className="mx-auto max-w-2xl space-y-5 text-center">
      <p className="text-gray-600">Extract selectable PDF text into editable worksheet rows. Scanned PDFs need OCR first.</p>
      <input type="file" accept="application/pdf,.pdf" onChange={(event) => setFile(event.target.files?.[0] || null)} className="block w-full rounded-lg border p-4" />
      {file && <p className="text-sm text-gray-600">{file.name}</p>}
      <button onClick={convert} disabled={!file || loading} className="w-full rounded-xl bg-indigo-600 py-3 font-medium text-white disabled:opacity-50">{loading ? "Extracting…" : "Convert to Excel"}</button>
    </div>
  </ToolLayout>;
}
