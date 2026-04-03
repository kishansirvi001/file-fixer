import React, { useState, useEffect } from "react";
import Tesseract from "tesseract.js";
import ToolLayout from "@/components/ToolLayout";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph } from "docx";
import { saveAs } from "file-saver";
function ImageToText() {
  const [file, setFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      if (imageURL) URL.revokeObjectURL(imageURL);
      setImageURL(URL.createObjectURL(selectedFile));
      setText("");
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleUpload({ target: { files: [droppedFile] } });
  };

  const handleConvert = () => {
    if (!file) return;
    setLoading(true);
    setProgress(0);

    Tesseract.recognize(file, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress(Math.round(m.progress * 100));
        }
      },
    })
      .then(({ data: { text } }) => setText(text.trim()))
      .catch(() => alert("Error extracting text"))
      .finally(() => setLoading(false));
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  const downloadText = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "extracted-text.txt");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(text, 180);
    let y = 10;
    lines.forEach((line) => {
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
      doc.text(line, 10, y);
      y += 7;
    });
    doc.save("extracted-text.pdf");
  };

  const downloadWord = async () => {
    const paragraphs = text.split("\n").map((line) => new Paragraph(line));
    const doc = new Document({ sections: [{ children: paragraphs }] });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "extracted-text.docx");
  };

  useEffect(() => {
    return () => {
      if (imageURL) URL.revokeObjectURL(imageURL);
    };
  }, [imageURL]);

  return (
    <ToolLayout title="Image to Text (OCR)">
      <div
        className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {/* Upload */}
        <label className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition">
          <p className="text-gray-500 text-lg">Drag & Drop or Click to Upload Image</p>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>

        {/* Preview */}
        {imageURL && (
          <div className="mt-6 text-center">
            <img
              src={imageURL}
              alt="preview"
              className="max-h-64 mx-auto rounded-xl shadow-md"
            />
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
            {loading ? "Extracting..." : "Extract Text"}
          </button>
        </div>

        {/* Progress */}
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

        {/* Output */}
        {text && (
          <div className="mt-6">
            <textarea
              value={text}
              readOnly
              className="w-full h-48 p-4 border rounded-xl focus:outline-none"
            />

            {/* Actions */}
            <div className="flex gap-4 mt-4 justify-center flex-wrap">
              <button onClick={copyText} className="px-4 py-2 bg-green-600 text-white rounded-lg">
                Copy
              </button>
              <button onClick={downloadText} className="px-4 py-2 bg-gray-800 text-white rounded-lg">
                TXT
              </button>
              <button onClick={downloadPDF} className="px-4 py-2 bg-red-600 text-white rounded-lg">
                PDF
              </button>
              <button onClick={downloadWord} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Word
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default ImageToText;