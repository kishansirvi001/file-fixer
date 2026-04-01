import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function PdfToWord() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleUpload({ target: { files: [droppedFile] } });
  };

  const handleConvert = async () => {
    if (!file) return alert("Please select a PDF file");
    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://127.0.0.1:8000/convert", true);
      xhr.responseType = "blob";

      // Track upload progress
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const blob = xhr.response;
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = file.name.replace(".pdf", ".docx");
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
          alert("Conversion complete!");
        } else {
          alert("Conversion failed!");
        }
        setLoading(false);
      };

      xhr.onerror = () => {
        alert("Error converting PDF");
        setLoading(false);
      };

      xhr.send(formData);
    } catch (err) {
      console.error(err);
      alert("Error converting PDF");
      setLoading(false);
    }
  };

  return (
    <ToolLayout title="PDF to Word Converter">
      <div
        className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {/* Upload */}
        <label className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition">
          <p className="text-gray-500 text-lg">Drag & Drop or Click to Upload PDF</p>
          <input type="file" accept="application/pdf" onChange={handleUpload} className="hidden" />
        </label>

        {/* File Info */}
        {file && (
          <div className="mt-4 text-center text-gray-700">
            Selected: <strong>{file.name}</strong>
          </div>
        )}

        {/* Convert Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleConvert}
            disabled={!file || loading}
            className={`px-8 py-3 rounded-xl text-white font-semibold transition ${
              !file ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? `Converting... ${progress}%` : "Convert to Word"}
          </button>
        </div>

        {/* Progress Bar */}
        {loading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-center text-sm mt-1 text-gray-500">{progress}%</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}