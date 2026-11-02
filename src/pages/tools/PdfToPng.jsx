import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { downloadPagesAsImages } from "@/lib/pdfTools";

export default function PdfToPng() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const convert = async () => {
    if (!file) return;
    setLoading(true);
    try {
      await downloadPagesAsImages(file, "png", (page, total) => setStatus(`Rendering page ${page} of ${total}…`));
    } catch (error) {
      alert(error.message || "Could not convert this PDF.");
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  return <ToolLayout title="PDF to PNG Converter">
    <div className="mx-auto max-w-2xl space-y-5 text-center">
      <p className="text-gray-600">Render every page as a PNG image and download them together in a ZIP file.</p>
      <input type="file" accept="application/pdf,.pdf" onChange={(event) => setFile(event.target.files?.[0] || null)} className="block w-full rounded-lg border p-4" />
      {file && <p className="text-sm text-gray-600">{file.name}</p>}
      <button onClick={convert} disabled={!file || loading} className="w-full rounded-xl bg-indigo-600 py-3 font-medium text-white disabled:opacity-50">{loading ? status || "Converting…" : "Convert to PNG"}</button>
    </div>
  </ToolLayout>;
}
