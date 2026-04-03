import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";

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
import Welcome from "./pages/Welcome";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Main pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Tools */}
 <Route
  path="/image-compressor"
  element={
    <ProtectedRoute>
      <ImageCompressor />
    </ProtectedRoute>
  }
/>

<Route
  path="/image-to-text"
  element={
    <ProtectedRoute>
      <ImageToText />
    </ProtectedRoute>
  }
/>

<Route
  path="/jpg-to-pdf"
  element={
    <ProtectedRoute>
      <JpgToPdf />
    </ProtectedRoute>
  }
/>

<Route
  path="/pdf-compressor"
  element={
    <ProtectedRoute>
      <PdfCompressor />
    </ProtectedRoute>
  }
/>

<Route
  path="/pdf-merge"
  element={
    <ProtectedRoute>
      <PdfMerge />
    </ProtectedRoute>
  }
/>

<Route
  path="/pdf-to-excel"
  element={
    <ProtectedRoute>
      <PdfToExcel />
    </ProtectedRoute>
  }
/>

<Route
  path="/pdf-to-jpg"
  element={
    <ProtectedRoute>
      <PdfToJpg />
    </ProtectedRoute>
  }
/>

<Route
  path="/pdf-to-png"
  element={
    <ProtectedRoute>
      <PdfToPng />
    </ProtectedRoute>
  }
/>

<Route
  path="/pdf-to-text"
  element={
    <ProtectedRoute>
      <PdfToText />
    </ProtectedRoute>
  }
/>

<Route
  path="/pdf-to-word"
  element={
    <ProtectedRoute>
      <PdfToWord />
    </ProtectedRoute>
  }
/>

<Route
  path="/png-to-pdf"
  element={
    <ProtectedRoute>
      <PngToPdf />
    </ProtectedRoute>
  }
/>

<Route
  path="/protect-pdf"
  element={
    <ProtectedRoute>
      <ProtectPdf />
    </ProtectedRoute>
  }
/>

<Route
  path="/scan-to-pdf"
  element={
    <ProtectedRoute>
      <ScanToPdf />
    </ProtectedRoute>
  }
/>

<Route
  path="/unlock-pdf"
  element={
    <ProtectedRoute>
      <UnlockPdf />
    </ProtectedRoute>
  }
/>

<Route
  path="/word-to-pdf"
  element={
    <ProtectedRoute>
      <WordToPdf />
    </ProtectedRoute>
  }
/>

<Route
  path="/zip-to-pdf"
  element={
    <ProtectedRoute>
      <ZipToPdf />
    </ProtectedRoute>
  }
/>

<Route
  path="/welcome"
  element={
    <ProtectedRoute>
      <Welcome />
    </ProtectedRoute>
  }
/>
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;