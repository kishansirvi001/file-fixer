import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { PDF_API_BASE } from "@/config";

export default function WordToPdf() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const convert = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch(`${PDF_API_BASE}/word-to-pdf`, { method: "POST", body: form });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.detail || "The conversion service could not convert this document.");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${file.name.replace(/\.docx$/i, "")}.pdf`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      alert(error.message || "Could not convert this Word document.");
    } finally {
      setLoading(false);
    }
  };

  return <ToolLayout title="Word to PDF Converter">
    <div className="mx-auto max-w-2xl space-y-5 text-center">
      <p className="text-gray-600">Convert a DOCX document to a text based PDF. Text and paragraph order are preserved.</p>
      <input type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => setFile(event.target.files?.[0] || null)} className="block w-full rounded-lg border p-4" />
      {file && <p className="text-sm text-gray-600">{file.name}</p>}
      <button onClick={convert} disabled={!file || loading} className="w-full rounded-xl bg-indigo-600 py-3 font-medium text-white disabled:opacity-50">{loading ? "Converting…" : "Convert to PDF"}</button>
    </div>
  </ToolLayout>;
}
