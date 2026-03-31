import React, { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import JSZip from "jszip";
import { jsPDF } from "jspdf";

function ZipToPdf() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [imageCount, setImageCount] = useState(0);

  // 🔥 HANDLE FILE
  const handleFile = async (selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setOutput("");

    // Preview: count images inside zip
    const zip = new JSZip();
    const content = await zip.loadAsync(selectedFile);

    const images = Object.values(content.files).filter(
      (f) => !f.dir && /\.(png|jpg|jpeg)$/i.test(f.name)
    );

    setImageCount(images.length);
  };

  // 🔥 CONVERT
  const handleConvert = async () => {
    if (!file) return alert("Upload ZIP first!");

    setLoading(true);
    setOutput("");

    const zip = new JSZip();
    const content = await zip.loadAsync(file);
    const pdf = new jsPDF();
    let firstPage = true;

    const imageFiles = Object.values(content.files).filter(
      (f) => !f.dir && /\.(png|jpg|jpeg)$/i.test(f.name)
    );

    if (imageFiles.length === 0) {
      setLoading(false);
      return alert("No images found!");
    }

    for (const imgFile of imageFiles) {
      const imgData = await imgFile.async("base64");
      const img = new Image();
      img.src = `data:image/*;base64,${imgData}`;

      await new Promise((resolve) => {
        img.onload = () => {
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();

          const ratio = Math.min(
            pageWidth / img.width,
            pageHeight / img.height
          );

          const imgWidth = img.width * ratio;
          const imgHeight = img.height * ratio;

          const x = (pageWidth - imgWidth) / 2;
          const y = (pageHeight - imgHeight) / 2;

          if (!firstPage) pdf.addPage();
          pdf.addImage(img, "JPEG", x, y, imgWidth, imgHeight);

          firstPage = false;
          resolve();
        };
      });
    }

    pdf.save("converted.pdf");
    setLoading(false);
    setOutput("✅ PDF generated successfully!");
  };

  return (
    <ToolLayout title="ZIP to PDF">
      <div className="max-w-xl mx-auto">

        {/* CARD */}
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg border hover:shadow-2xl transition">

          {/* HEADER */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🗂️</div>
            <h2 className="text-2xl font-bold text-indigo-700">
              ZIP to PDF
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              Convert images inside a ZIP file into a single PDF
            </p>
          </div>

          {/* 🔥 DROP AREA */}
          <label className="block border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400 transition">
            <p className="text-gray-600 font-medium">
              Drag & drop ZIP file or click to upload
            </p>
            <input
              type="file"
              accept=".zip"
              onChange={(e) => handleFile(e.target.files[0])}
              className="hidden"
            />
          </label>

          {/* 🔥 FILE INFO */}
          {file && (
            <div className="mt-5 bg-indigo-50 p-4 rounded-lg text-sm">
              <p className="font-medium text-indigo-700">
                📁 {file.name}
              </p>
              <p className="text-gray-600 mt-1">
                {imageCount} images detected
              </p>
            </div>
          )}

          {/* 🔥 BUTTON */}
          <button
            onClick={handleConvert}
            disabled={!file || loading}
            className={`w-full mt-6 py-3 rounded-xl font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
            }`}
          >
            {loading ? "Processing..." : "Convert to PDF"}
          </button>

          {/* 🔥 SUCCESS */}
          {output && (
            <p className="mt-4 text-green-600 text-center font-medium">
              {output}
            </p>
          )}
        </div>

      </div>
    </ToolLayout>
  );
}

export default ZipToPdf;