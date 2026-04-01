import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ImageCompressor from "./pages/tools/ImageCompressor";
import JpgToPdf from "./pages/tools/JpgToPdf";
import PdfMerge from "./pages/tools/PdfMerge";
import PdfCompressor from "./pages/tools/PdfCompressor";
import ImageToText from "./pages/tools/ImageToText";
import PdfToText from "./pages/tools/PdfToText";
import Footer from "./components/Footer";
import PdfToWord from "./pages/tools/PdfToWord";
import PdfToJpg from "./pages/tools/PdfToJpg";
import PdfToExcel from "./pages/tools/PdfToExcel";
import PdfToPng from "./pages/tools/PdfToPng";  
import WordToPdf from "./pages/tools/WordToPdf"; 
import PngToPdf from "./pages/tools/PngToPdf";
import ZipToPdf from "./pages/tools/ZipToPdf";
import ProtectPdf from "./pages/tools/ProtectPdf";
import UnlockPdf from "./pages/tools/UnlockPdf";
import ScanToPdf from "./pages/tools/ScanToPdf";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />

        {/* Main Content */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/compress-image" element={<ImageCompressor />} />
            <Route path="/jpg-to-pdf" element={<JpgToPdf />} />
            <Route path="/merge-pdf" element={<PdfMerge />} />
            <Route path="/compress-pdf" element={<PdfCompressor />} />
            <Route path="/image-to-text" element={<ImageToText />} />
            <Route path="/pdf-to-text" element={<PdfToText />} />
            <Route path="/pdf-to-word" element={<PdfToWord/>}/>
            <Route path="/pdf-to-jpg" element={<PdfToJpg />} />
            <Route path="/pdf-to-excel" element={<PdfToExcel />} />
            <Route path="/pdf-to-png" element={<PdfToPng />} /> 
            <Route path="/word-to-pdf" element={<WordToPdf />} />
            <Route path="/png-to-pdf" element={<PngToPdf />} />
            <Route path="/zip-to-pdf" element={<ZipToPdf />} />
             <Route path="/protect-pdf" element={<ProtectPdf />} />
             <Route path="/unlock-pdf" element={<UnlockPdf />} />
             <Route path="/scan-to-pdf" element={<ScanToPdf />} />
          </Routes>
        
        </div>

        {/* ✅ Footer added here */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;