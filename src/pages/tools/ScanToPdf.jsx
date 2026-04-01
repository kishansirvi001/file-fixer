import { useRef, useState, useEffect } from "react";
import jsPDF from "jspdf";

export default function ScanToPdf() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
const btnStyle = {
  padding: "10px 16px",
  borderRadius: "8px",
  border: "none",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500"
};
  // 🎥 Start Camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setStream(mediaStream);
    } catch (err) {
      alert("Camera permission denied or not working");
      console.error(err);
    }
  };

  // 📸 Capture Image
  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");

    // Match canvas size to video
    canvas.width = video.videoWidth || 300;
    canvas.height = video.videoHeight || 220;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  };

  // 📄 Convert to PDF
  const downloadPDF = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();

    const imgWidth = 180;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save("document.pdf");
  };

  // 🛑 Stop camera when leaving page
  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  return (
  <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "30px",
    fontFamily: "Arial"
  }}>
    
    <h2 style={{ marginBottom: "20px" }}>📷 Scan to PDF</h2>

    {/* Camera Preview */}
    <div style={{
      border: "2px solid #ddd",
      borderRadius: "12px",
      padding: "10px",
      background: "#f9f9f9"
    }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: "320px",
          height: "240px",
          borderRadius: "10px",
          objectFit: "cover"
        }}
      ></video>
    </div>

    {/* Buttons */}
    <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
      
      <button onClick={startCamera} style={btnStyle}>
        🎥 Start
      </button>

      <button onClick={capture} style={btnStyle}>
        📸 Capture
      </button>

      <button onClick={downloadPDF} style={btnStyle}>
        📄 Download
      </button>

    </div>

    {/* Canvas Preview */}
    <div style={{ marginTop: "25px" }}>
      <canvas
        ref={canvasRef}
        style={{
          width: "320px",
          borderRadius: "10px",
          border: "2px solid #ddd"
        }}
      ></canvas>
    </div>
  </div>
);
}