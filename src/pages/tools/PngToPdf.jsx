import React, { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { jsPDF } from "jspdf";

function PngToPdf() {
  const [files, setFiles] = useState([]);
  const [output, setOutput] = useState(null);

  const handleConvert = async () => {
    if (files.length === 0) return alert("Please upload at least one PNG image!");

    const pdf = new jsPDF();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imgData = await fileToDataURL(file);

      const img = new Image();
      img.src = imgData;
      await new Promise((resolve) => {
        img.onload = () => {
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
          const imgWidth = img.width * ratio;
          const imgHeight = img.height * ratio;
          const x = (pageWidth - imgWidth) / 2;
          const y = (pageHeight - imgHeight) / 2;

          if (i !== 0) pdf.addPage();
          pdf.addImage(img, "PNG", x, y, imgWidth, imgHeight);
          resolve();
        };
      });
    }

    pdf.save("converted.pdf");
    setOutput("PDF generated successfully!");
  };

  const fileToDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <ToolLayout title="PNG to PDF">
      <div className="bg-white p-7 rounded-2xl shadow-md text-center border border-transparent hover:border-indigo-100 transition-all duration-300">
        <div className="text-5xl mb-4">🖼️</div>
        <h3 className="text-xl font-semibold mb-2">PNG to PDF</h3>
        <p className="text-gray-600 mb-4">
          Convert your PNG images into PDF files instantly.
        </p>
        <input
          type="file"
          accept="image/png"
          multiple
          onChange={(e) => setFiles([...e.target.files])}
          className="mb-4"
        />
        <button
          onClick={handleConvert}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Convert to PDF
        </button>
        {output && <p className="mt-4 text-green-600">{output}</p>}
      </div>
    </ToolLayout>
  );
}

export default PngToPdf;