import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import toast, { Toaster } from "react-hot-toast";
import { PDF_API_BASE } from "@/config";

function UnlockPdf() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = (f) => {
    if (!f) return;

    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Only PDF allowed");
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
    if (!file) return toast.error("Select file");
    if (!password) return toast.error("Enter password");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", password);

    try {
      setLoading(true);

      const res = await fetch(`${PDF_API_BASE}/unlock-pdf`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || "Could not unlock this PDF.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.replace(/\.pdf$/i, "")}-unlocked.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      toast.success("PDF Unlocked 🎉");

    } catch (err) {
      toast.error(err instanceof TypeError
        ? "PDF service did not respond. Check the Vite terminal for its startup error, then restart npm run dev."
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      title="Unlock PDF"
      description="Remove password protection from your PDF."
    >
      <Toaster position="top-right" />

      <div className="max-w-xl mx-auto space-y-6">

        {/* Drag & Drop */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed p-8 rounded-xl text-center"
        >
          <p>Drag & drop locked PDF</p>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>

        {/* File */}
        {file && (
          <div className="bg-gray-100 p-3 rounded flex justify-between">
            <span>{file.name}</span>
            <button onClick={() => setFile(null)}>Remove</button>
          </div>
        )}

        {/* Password */}
        <input
          type="password"
          placeholder="Enter PDF password"
          className="border p-3 rounded w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !file || !password}
          className="bg-green-600 text-white py-3 rounded w-full"
        >
          {loading ? "Unlocking..." : "Unlock PDF"}
        </button>

      </div>
    </ToolLayout>
  );
}

export default UnlockPdf;
