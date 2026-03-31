import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import ToolLayout from "@/components/ToolLayout";

function PdfMerge() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = (fileList) => {
    const selected = Array.from(fileList);
    setFiles((prev) => [...prev, ...selected]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index) =>
    setFiles(files.filter((_, i) => i !== index));

  const moveUp = (index) => {
    if (index === 0) return;
    const newFiles = [...files];
    [newFiles[index - 1], newFiles[index]] = [
      newFiles[index],
      newFiles[index - 1],
    ];
    setFiles(newFiles);
  };

  const moveDown = (index) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    [newFiles[index + 1], newFiles[index]] = [
      newFiles[index],
      newFiles[index + 1],
    ];
    setFiles(newFiles);
  };

  const mergePDFs = async () => {
    if (files.length < 2) return alert("Upload at least 2 PDFs");

    setLoading(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (let file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
    } catch (err) {
      alert("Error merging PDFs");
      console.error(err);
    }

    setLoading(false);
  };
return (
  <ToolLayout title="Merge PDFs">
    
    {/* Center Container */}
    <div className="max-w-3xl mx-auto">

      {/* Upload Box (Main Focus) */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:bg-gray-50 transition mb-8"
      >
        <input
          type="file"
          multiple
          accept="application/pdf"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          id="pdfUpload"
        />

        <label htmlFor="pdfUpload" className="cursor-pointer">
          <div className="text-5xl mb-4">📄</div>
          <p className="text-lg font-semibold text-gray-800">
            Upload your PDF files
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Drag & drop or click to select
          </p>
        </label>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">
            Files ({files.length})
          </h3>

          <div className="space-y-3">
            {files.map((file, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 hover:bg-gray-100 transition"
              >
                <span className="text-sm text-gray-700 truncate w-48">
                  {file.name}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveUp(i)}
                    className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    ↑
                  </button>

                  <button
                    onClick={() => moveDown(i)}
                    className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    ↓
                  </button>

                  <button
                    onClick={() => removeFile(i)}
                    className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Merge Button */}
      {files.length > 0 && (
        <button
          onClick={mergePDFs}
          className={`w-full py-3 rounded-xl text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Merging PDFs..." : "Merge PDFs"}
        </button>
      )}
    </div>
  </ToolLayout>
);
}

export default PdfMerge;