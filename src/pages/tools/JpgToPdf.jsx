import React, { useState } from "react";
import { jsPDF } from "jspdf";
import ToolLayout from "@/components/ToolLayout";

function JpgToPdf() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = (files) => {
    const fileArray = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...fileArray]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => setImages(images.filter((_, i) => i !== index));

  const fileToBase64 = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
    });

  const loadImage = (file) =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => resolve(img);
    });

  const convertToPDF = async () => {
    if (images.length === 0) return alert("Upload images first");

    setLoading(true);
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < images.length; i++) {
      const img = await loadImage(images[i].file);
      const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;
      const x = (pageWidth - newWidth) / 2;
      const y = (pageHeight - newHeight) / 2;
      const imgData = await fileToBase64(images[i].file);

      if (i !== 0) pdf.addPage();
      pdf.addImage(imgData, "JPEG", x, y, newWidth, newHeight);
    }

    pdf.save("converted.pdf");
    setLoading(false);
  };

return (
  <ToolLayout title="JPG to PDF Converter">
    
    {/* Center Container */}
    <div className="max-w-3xl mx-auto">

      {/* Upload Box */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:bg-gray-50 transition mb-8"
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          id="jpgUpload"
        />

        <label htmlFor="jpgUpload" className="cursor-pointer">
          <div className="text-5xl mb-4">🖼️</div>
          <p className="text-lg font-semibold text-gray-800">
            Upload your images
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Drag & drop or click to select
          </p>
        </label>
      </div>

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">
            Images ({images.length})
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative bg-gray-50 rounded-xl p-2 group"
              >
                <img
                  src={img.preview}
                  alt="preview"
                  className="rounded-lg h-28 w-full object-cover"
                />

                {/* Remove Button */}
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 rounded opacity-80 hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Convert Button */}
      {images.length > 0 && (
        <button
          onClick={convertToPDF}
          className={`w-full py-3 rounded-xl text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Generating PDF..." : "Convert to PDF"}
        </button>
      )}
    </div>
  </ToolLayout>
);
}

export default JpgToPdf;