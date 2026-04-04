// App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Welcome from "./pages/Welcome";

// Tools
import ImageCompressor from "./pages/tools/ImageCompressor";
import ImageToText from "./pages/tools/ImageToText";
import JpgToPdf from "./pages/tools/JpgToPdf";
import PdfCompressor from "./pages/tools/PdfCompressor";
import PdfMerge from "./pages/tools/PdfMerge";
import PdfToExcel from "./pages/tools/PdfToExcel";
import PdfToJpg from "./pages/tools/PdfToJpg";
import PdfToPng from "./pages/tools/PdfToPng";
import PdfToText from "./pages/tools/PdfToText";
import PdfToWord from "./pages/tools/PdfToWord";
import PngToPdf from "./pages/tools/PngToPdf";
import ProtectPdf from "./pages/tools/ProtectPdf";
import ScanToPdf from "./pages/tools/ScanToPdf";
import UnlockPdf from "./pages/tools/UnlockPdf";
import WordToPdf from "./pages/tools/WordToPdf";
import ZipToPdf from "./pages/tools/ZipToPdf";

// Helper array to simplify routes
const protectedTools = [
  { path: "/image-compressor", component: <ImageCompressor /> },
  { path: "/image-to-text", component: <ImageToText /> },
  { path: "/jpg-to-pdf", component: <JpgToPdf /> },
  { path: "/pdf-compressor", component: <PdfCompressor /> },
  { path: "/pdf-merge", component: <PdfMerge /> },
  { path: "/pdf-to-excel", component: <PdfToExcel /> },
  { path: "/pdf-to-jpg", component: <PdfToJpg /> },
  { path: "/pdf-to-png", component: <PdfToPng /> },
  { path: "/pdf-to-text", component: <PdfToText /> },
  { path: "/pdf-to-word", component: <PdfToWord /> },
  { path: "/png-to-pdf", component: <PngToPdf /> },
  { path: "/protect-pdf", component: <ProtectPdf /> },
  { path: "/scan-to-pdf", component: <ScanToPdf /> },
  { path: "/unlock-pdf", component: <UnlockPdf /> },
  { path: "/word-to-pdf", component: <WordToPdf /> },
  { path: "/zip-to-pdf", component: <ZipToPdf /> },
  { path: "/welcome", component: <Welcome /> },
];

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Main pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected tool pages */}
        {protectedTools.map((tool) => (
          <Route
            key={tool.path}
            path={tool.path}
            element={<ProtectedRoute>{tool.component}</ProtectedRoute>}
          />
        ))}
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;s