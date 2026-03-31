import React, { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { PDFDocument } from "pdf-lib";

function PdfCompressor() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (selectedFile) => {
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please upload a valid PDF file");
    }
  };

  const compressPDF = async () => {
    if (!file) return;

    setLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();

      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Re-save PDF (this sometimes reduces size slightly)
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
      });

      const blob = new Blob([compressedBytes], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "compressed.pdf";
      a.click();

    } catch (err) {
      alert("Compression failed");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <ToolLayout title="PDF Compressor">

      <div className="max-w-xl mx-auto text-center">

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => handleFile(e.target.files[0])}
          className="mb-4"
        />

        {file && (
          <p className="text-gray-600 text-sm">
            {file.name}
          </p>
        )}

        <button
          onClick={compressPDF}
          disabled={!file || loading}
          className={`mt-4 px-6 py-2 rounded-lg ${
            file
              ? "bg-indigo-600 text-white"
              : "bg-gray-300 text-gray-500"
          }`}
        >
          {loading ? "Compressing..." : "Compress PDF"}
        </button>

      </div>
    </ToolLayout>
  );
}

export default PdfCompressor;