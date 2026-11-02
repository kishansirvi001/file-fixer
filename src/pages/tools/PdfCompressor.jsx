import { useState } from "react";
import { jsPDF } from "jspdf";
import ToolLayout from "@/components/ToolLayout";
import { loadPdf } from "@/lib/pdfTools";

export default function PdfCompressor() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quality, setQuality] = useState(65);
  const [resultSize, setResultSize] = useState(null);

  const compress = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const pdf = await loadPdf(file);
      const firstPage = await pdf.getPage(1);
      const firstViewport = firstPage.getViewport({ scale: 1 });
      const output = new jsPDF({ unit: "pt", format: [firstViewport.width, firstViewport.height], compress: true });
      for (let number = 1; number <= pdf.numPages; number += 1) {
        const page = await pdf.getPage(number);
        const viewport = page.getViewport({ scale: 1 });
        const raster = page.getViewport({ scale: 1.35 });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(raster.width);
        canvas.height = Math.ceil(raster.height);
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Could not render this PDF page.");
        await page.render({ canvasContext: context, viewport: raster }).promise;
        if (number > 1) output.addPage([viewport.width, viewport.height]);
        output.addImage(canvas.toDataURL("image/jpeg", quality / 100), "JPEG", 0, 0, viewport.width, viewport.height);
        canvas.width = 0;
        canvas.height = 0;
      }
      const blob = output.output("blob");
      setResultSize(blob.size);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${file.name.replace(/\.pdf$/i, "")}-compressed.pdf`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      alert(error.message || "Compression failed. The PDF may be password protected or damaged.");
    } finally {
      setLoading(false);
    }
  };

  return <ToolLayout title="PDF Compressor">
    <div className="mx-auto max-w-xl space-y-5 text-center">
      <p className="text-gray-600">Rebuild PDF pages as compressed images. This can reduce file size but makes page text non selectable.</p>
      <input type="file" accept="application/pdf,.pdf" onChange={(event) => { setFile(event.target.files?.[0] || null); setResultSize(null); }} className="block w-full rounded-lg border p-4" />
      {file && <><p className="text-sm text-gray-600">Original: {(file.size / 1024).toFixed(1)} KB</p><label className="block text-sm text-gray-700">Image quality: {quality}%<input className="mt-2 w-full" type="range" min="25" max="90" value={quality} onChange={(event) => setQuality(Number(event.target.value))} /></label></>}
      <button onClick={compress} disabled={!file || loading} className="w-full rounded-xl bg-indigo-600 py-3 font-medium text-white disabled:opacity-50">{loading ? "Compressing…" : "Compress PDF"}</button>
      {resultSize !== null && <p className="text-sm text-gray-600">Compressed output: {(resultSize / 1024).toFixed(1)} KB</p>}
    </div>
  </ToolLayout>;
}
