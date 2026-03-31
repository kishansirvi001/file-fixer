import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import ToolLayout from "@/components/ToolLayout";

function PdfToWord() {
  const location = useLocation();
  const fileInputRef = useRef();

  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [outputURL, setOutputURL] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  // 🔥 AUTO LOAD FILE FROM HERO SECTION
  useEffect(() => {
    if (location.state?.file) {
      setFile(location.state.file);
      setFileURL(URL.createObjectURL(location.state.file));
    }
  }, [location]);

  // 🔥 HANDLE FILE
  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setFileURL(URL.createObjectURL(selectedFile));
    setOutputURL(null);
    setError(null);
  };

  // 🔥 HANDLE CONVERSION
  const handleConvert = async () => {
    if (!file) return alert("Upload PDF first");
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:5000/pdf-to-word", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Conversion failed");
      }

      // Get blob from response
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setOutputURL(url);
    } catch (err) {
      console.error(err);
      setError(err.message || "Conversion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout title="PDF to Word">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700">PDF to Word</h1>
          <p className="text-gray-500 mt-2">Convert PDF into editable Word documents</p>
        </div>

        {/* UPLOAD AREA */}
        {!file && (
          <div
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition ${
              dragActive ? "border-indigo-600 bg-indigo-50" : "border-gray-300 bg-white"
            }`}
            onClick={() => fileInputRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              handleFile(e.dataTransfer.files[0]);
            }}
          >
            <div className="text-5xl mb-3">📄</div>
            <p className="font-medium">Drag & drop PDF here</p>
            <p className="text-sm text-gray-400">or click to upload</p>
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>
        )}

        {/* FILE PREVIEW */}
        {file && (
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="font-medium text-indigo-700">📁 {file.name}</p>
                <p className="text-xs text-gray-400">✔ File ready</p>
              </div>
              <button
                onClick={() => { setFile(null); setOutputURL(null); setError(null); }}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </div>

            {/* PDF PREVIEW */}
            <iframe src={fileURL} title="preview" className="w-full h-72 rounded-lg border mb-4" />

            {/* CONVERT BUTTON */}
            <button
              onClick={handleConvert}
              disabled={loading}
              className={`w-full mt-2 py-3 rounded-xl font-semibold transition ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow"
              }`}
            >
              {loading ? "Converting..." : "Convert to Word"}
            </button>

            {/* ERROR MESSAGE */}
            {error && <p className="mt-3 text-red-500">{error}</p>}
          </div>
        )}

        {/* OUTPUT */}
        {outputURL && (
          <div className="mt-6 text-center bg-green-50 p-4 rounded-xl">
            <p className="text-green-600 font-medium mb-2">✅ Conversion Complete</p>
            <a
              href={outputURL}
              download="converted.docx"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Download Word File
            </a>
          </div>
        )}

        {/* TRUST BADGES */}
        <div className="mt-10 text-sm text-gray-400 flex justify-center gap-6">
          <span>🔒 Secure</span>
          <span>⚡ Fast</span>
          <span>🆓 Free</span>
        </div>
      </div>
    </ToolLayout>
  );
}

export default PdfToWord;