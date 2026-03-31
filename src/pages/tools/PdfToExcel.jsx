import React, { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

function PdfToExcel() {
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConvert = () => {
    if (!file) return alert("Please upload a PDF first");

    setLoading(true);

    // Demo conversion (replace with real API later)
    setTimeout(() => {
      const fake = URL.createObjectURL(file);
      setOutput(fake);
      setLoading(false);
    }, 2000);
  };

  return (
    <ToolLayout title="PDF to Excel Converter">
      <div className="max-w-2xl mx-auto text-center">

        {/* Title */}
        <h1 className="text-3xl font-bold mb-2">Convert PDF to Excel</h1>
        <p className="text-gray-500 mb-6">
          Quickly convert your PDF tables into editable Excel (.xlsx) spreadsheets.
        </p>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 cursor-pointer hover:border-indigo-500 transition bg-white shadow-sm">
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            id="upload"
            onChange={(e) => {
              setFile(e.target.files[0]);
              setOutput(null);
            }}
          />

          <label htmlFor="upload" className="cursor-pointer">
            <div className="text-5xl mb-3">📊</div>
            <p className="text-lg font-medium">{file ? file.name : "Select PDF file"}</p>
            <p className="text-sm text-gray-400">or drag and drop here</p>
          </label>
        </div>

        {/* Convert Button */}
        <button
          onClick={handleConvert}
          disabled={loading}
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
        >
          {loading ? "Converting..." : "Convert to Excel"}
        </button>

        {/* Output */}
        {output && (
          <div className="mt-6">
            <a
              href={output}
              download="converted.xlsx"
              className="text-indigo-600 font-semibold underline"
            >
              Download Excel File
            </a>
          </div>
        )}

        {/* Trust Badges */}
        <div className="mt-10 text-sm text-gray-400 flex justify-center gap-6">
          <span>🔒 Secure</span>
          <span>⚡ Fast</span>
          <span>🆓 Free</span>
        </div>

      </div>
    </ToolLayout>
  );
}

export default PdfToExcel;