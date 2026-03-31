import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import toast, { Toaster } from "react-hot-toast";

function ProtectPdf() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Password strength
  const getStrength = () => {
    if (password.length > 8) return { text: "Strong", color: "text-green-600" };
    if (password.length > 4) return { text: "Medium", color: "text-yellow-600" };
    return { text: "Weak", color: "text-red-600" };
  };

  const handleFile = (f) => {
    if (!f) return;

    if (f.type !== "application/pdf") {
      toast.error("Only PDF files allowed");
      return;
    }

    setFile(f);
    toast.success("File selected");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return toast.error("Select a PDF");
    if (!password) return toast.error("Enter password");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", password);

    try {
      setLoading(true);
      setProgress(20);

      const res = await fetch("http://localhost:5000/protect-pdf", {
        method: "POST",
        body: formData,
      });

      setProgress(70);

      if (!res.ok) throw new Error(await res.text());

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = file.name; // keep same name
      a.click();

      setProgress(100);
      toast.success("PDF Protected Successfully 🎉");

    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  const strength = getStrength();

  return (
    <ToolLayout
      title="Protect PDF"
      description="Encrypt your PDF with strong password security."
    >
      <Toaster position="top-right" />

      <div className="max-w-2xl mx-auto space-y-6">

        {/* Drag & Drop */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 p-10 rounded-2xl text-center hover:border-blue-500 transition cursor-pointer bg-white shadow-sm"
        >
          <p className="text-lg font-semibold">Drag & drop your PDF</p>
          <p className="text-sm text-gray-500">or click to upload</p>

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFile(e.target.files[0])}
            className="mt-4"
          />
        </div>

        {/* File Info + Preview */}
        {file && (
          <div className="bg-white p-4 rounded-xl shadow flex gap-4 items-center">

            {/* Preview (basic iframe preview) */}
            <iframe
              src={URL.createObjectURL(file)}
              title="preview"
              className="w-24 h-32 border rounded"
            />

            <div className="flex-1">
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>

            <button
              onClick={() => setFile(null)}
              className="text-red-500 text-sm"
            >
              Remove
            </button>
          </div>
        )}

        {/* Password */}
        <div className="bg-white p-4 rounded-xl shadow space-y-2">
          <input
            type="password"
            placeholder="Enter password"
            className="border p-3 rounded w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {password && (
            <p className={`text-sm ${strength.color}`}>
              Strength: {strength.text}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        {loading && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium"
        >
          {loading ? "Processing..." : "Protect PDF"}
        </button>

      </div>
    </ToolLayout>
  );
}

export default ProtectPdf;