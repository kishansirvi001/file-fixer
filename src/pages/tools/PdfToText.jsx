import React, { useState } from "react";
import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph } from "docx";
import { saveAs } from "file-saver";
import ToolLayout from "@/components/ToolLayout";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

let worker = null;

function PdfToText() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [dragging, setDragging] = useState(false);
  const [useOCR, setUseOCR] = useState(true); // 🔥 advanced toggle

  // OCR init
  const initWorker = async () => {
    if (!worker) {
      worker = await Tesseract.createWorker();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
    }
  };

  const handleUpload = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setText("");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type === "application/pdf") {
      setFile(f);
      setText("");
    }
  };

  // ✅ NORMAL TEXT (spacing improved)
  const extractNormalText = async (pdf) => {
    let output = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const lines = {};

      content.items.forEach((item) => {
        const y = Math.round(item.transform[5] / 5) * 5;
        if (!lines[y]) lines[y] = [];
        lines[y].push(item);
      });

      const sortedY = Object.keys(lines)
        .map(Number)
        .sort((a, b) => b - a);

      sortedY.forEach((y) => {
        const line = lines[y];
        line.sort((a, b) => a.transform[4] - b.transform[4]);

        let lineText = "";
        let lastX = 0;

        line.forEach((item, i) => {
          const x = item.transform[4];

          if (i > 0) {
            const gap = x - lastX;
            lineText += gap > 10 ? " ".repeat(Math.floor(gap / 5)) : " ";
          }

          lineText += item.str;
          lastX = x + item.width;
        });

        output += lineText + "\n";
      });

      output += "\n";
    }

    return output;
  };

  // ✅ OCR SAFE VERSION
  const extractOCR = async (pdf) => {
    let output = "";
    await initWorker();

    for (let i = 1; i <= pdf.numPages; i++) {
      setStatus(`OCR Page ${i}/${pdf.numPages}`);

      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;

      try {
        const { data } = await worker.recognize(canvas);

        if (!data.words) {
          output += `\n${data.text}\n`;
          continue;
        }

        let lineText = "";
        let lastX = 0;

        data.words.forEach((word, i) => {
          if (i > 0) {
            const gap = word.bbox.x0 - lastX;
            lineText += gap > 20 ? " ".repeat(Math.floor(gap / 10)) : " ";
          }
          lineText += word.text;
          lastX = word.bbox.x1;
        });

        output += `\n${lineText}\n`;
      } catch (err) {
        console.error(err);
        output += `\n[Error reading page ${i}]\n`;
      }
    }

    return output;
  };

  // ✅ MAIN
  const handleExtract = async () => {
    if (!file) return;

    setLoading(true);
    setText("");
    setStatus("Processing...");

    try {
      const pdf = await pdfjsLib.getDocument({
        data: await file.arrayBuffer(),
      }).promise;

      if (!useOCR) {
        const normal = await extractNormalText(pdf);
        setText(normal);
      } else {
        const ocr = await extractOCR(pdf);
        setText(ocr);
      }
    } catch (err) {
      console.error(err);
      alert("Error processing PDF");
    }

    setLoading(false);
    setStatus("");
  };

  // downloads
  const downloadTXT = () => {
    const blob = new Blob([text], { type: "text/plain" });
    saveAs(blob, "text.txt");
  };

  return (
    <ToolLayout title="PDF to Text OCR">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto text-center">

        {/* Upload */}
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-10 cursor-pointer ${
            dragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          Drag & Drop PDF or Click
          <input
            type="file"
            accept="application/pdf"
            onChange={handleUpload}
            className="hidden"
          />
        </label>

        {file && <p className="mt-2 text-sm">{file.name}</p>}

        {/* Advanced Toggle */}
        <div className="mt-4">
          <label className="flex items-center gap-2 justify-center">
            <input
              type="checkbox"
              checked={useOCR}
              onChange={() => setUseOCR(!useOCR)}
            />
            Use OCR (for scanned PDFs)
          </label>
        </div>

        {/* Button */}
        <button
          onClick={handleExtract}
          disabled={!file || loading}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl"
        >
          {loading ? "Processing..." : "Convert"}
        </button>

        {/* Status */}
        {loading && <p className="mt-3 text-gray-500">{status}</p>}

        {/* Output */}
        {text && (
          <>
            <textarea
              value={text}
              readOnly
              className="w-full h-52 mt-4 border p-3"
            />

            <button
              onClick={downloadTXT}
              className="mt-3 px-4 py-2 bg-black text-white rounded"
            >
              Download TXT
            </button>
          </>
        )}
      </div>
    </ToolLayout>
  );
}

export default PdfToText;