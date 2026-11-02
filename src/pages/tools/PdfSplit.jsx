import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import ToolLayout from "@/components/ToolLayout";

function parsePageSelection(value, pageCount) {
  const pages = new Set();
  for (const part of value.split(",").map((item) => item.trim()).filter(Boolean)) {
    const match = /^(\d+)(?:\s*-\s*(\d+))?$/.exec(part);
    if (!match) throw new Error("Enter pages like 1-3,5.");
    const start = Number(match[1]);
    const end = Number(match[2] || match[1]);
    if (start < 1 || end < start || end > pageCount) {
      throw new Error(`Choose page numbers from 1 to ${pageCount}.`);
    }
    for (let page = start; page <= end; page += 1) pages.add(page - 1);
  }
  if (!pages.size) throw new Error("Enter at least one page number.");
  return [...pages].sort((a, b) => a - b);
}

export default function PdfSplit() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(null);
  const [selection, setSelection] = useState("");
  const [loading, setLoading] = useState(false);

  const chooseFile = async (selected) => {
    setFile(null);
    setPageCount(null);
    setSelection("");
    if (!selected) return;
    try {
      const source = await PDFDocument.load(await selected.arrayBuffer());
      setFile(selected);
      setPageCount(source.getPageCount());
    } catch {
      alert("This PDF could not be opened. It may be damaged or password protected.");
    }
  };

  const split = async () => {
    if (!file || !pageCount) return;
    setLoading(true);
    try {
      const source = await PDFDocument.load(await file.arrayBuffer());
      const selectedPages = parsePageSelection(selection, pageCount);
      const output = await PDFDocument.create();
      const copiedPages = await output.copyPages(source, selectedPages);
      copiedPages.forEach((page) => output.addPage(page));
      const bytes = await output.save();
      const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${file.name.replace(/\.pdf$/i, "")}-pages.pdf`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      alert(error.message || "Could not split this PDF.");
    } finally {
      setLoading(false);
    }
  };

  return <ToolLayout title="Split PDF">
    <div className="mx-auto max-w-xl space-y-5 text-center">
      <p className="text-gray-600">Choose the pages to copy into a new PDF. Use a range and commas, such as 1-3,5.</p>
      <input type="file" accept="application/pdf,.pdf" onChange={(event) => chooseFile(event.target.files?.[0])} className="block w-full rounded-lg border p-4" />
      {file && <>
        <p className="text-sm text-gray-600">{file.name} · {pageCount} pages</p>
        <input value={selection} onChange={(event) => setSelection(event.target.value)} placeholder="Pages, e.g. 1-3,5" aria-label="Pages to keep" className="w-full rounded-lg border p-3" />
      </>}
      <button onClick={split} disabled={!file || !selection.trim() || loading} className="w-full rounded-xl bg-indigo-600 py-3 font-medium text-white disabled:opacity-50">{loading ? "Splitting…" : "Split PDF"}</button>
    </div>
  </ToolLayout>;
}
