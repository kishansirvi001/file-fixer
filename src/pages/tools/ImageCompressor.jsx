import React, { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";


function ImageCompressor() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [compressed, setCompressed] = useState(null);
  const [compressedBlob, setCompressedBlob] = useState(null);
  const [quality, setQuality] = useState(0.7);
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFiles = (files) => {
    const file = files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    setImage(file);
    setCompressed(null);
    setCompressedBlob(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  // Compress function (can be called in real-time for slider preview)
  const compressImage = async (targetQuality = quality) => {
    if (!image || !preview) return;
    setLoading(true);

    const img = new Image();
    img.src = preview;

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const maxWidth = 1024;
    const maxHeight = 1024;
    let width = img.width;
    let height = img.height;

    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = width * ratio;
      height = height * ratio;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    // Iterative compression to ~100 KB
    let q = targetQuality;
    let blob = await new Promise((res) =>
      canvas.toBlob(res, "image/jpeg", q)
    );

    while (blob && blob.size > 100 * 1024 && q > 0.1) {
      q -= 0.05;
      blob = await new Promise((res) =>
        canvas.toBlob(res, "image/jpeg", q)
      );
    }

    if (blob) {
      setCompressedBlob(blob);
      setCompressed(URL.createObjectURL(blob));
    }

    setLoading(false);
  };

  // Real-time compression on quality change
  useEffect(() => {
    if (image && preview) {
      compressImage(quality);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quality]);

  // Cleanup compressed object URL
  useEffect(() => {
    return () => {
      if (compressed) URL.revokeObjectURL(compressed);
    };
  }, [compressed]);

  return (
    <ToolLayout title="Image Compressor">
      <div className="max-w-3xl mx-auto">
        {/* Upload Box */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:bg-gray-50 transition mb-8"
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
            id="imgUpload"
          />
          <label htmlFor="imgUpload" className="cursor-pointer">
            <div className="text-5xl mb-4">🖼️</div>
            <p className="text-lg font-semibold text-gray-800">
              Upload your image
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Drag & drop or click to select
            </p>
          </label>
        </div>

        {/* Quality Slider */}
        {image && (
          <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Quality: {Math.round(quality * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full h-2 bg-gray-300 rounded-lg accent-indigo-600 cursor-pointer"
            />
          </div>
        )}

        {/* Preview Section */}
        {preview && (
          <div className="bg-white rounded-2xl shadow-md p-4 mb-6 text-center">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Preview</h3>
            <p className="text-xs text-gray-500 mb-2">
              Original Size: {(image.size / 1024).toFixed(2)} KB
            </p>
            <img
              src={preview}
              alt="Preview"
              className="rounded-lg max-h-64 mx-auto mb-4 object-contain"
            />
          </div>
        )}

        {/* Compressed Output */}
        {compressed && (
          <div className="bg-white rounded-2xl shadow-md p-4 text-center mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Compressed Image
            </h3>
            {compressedBlob && (
              <p className="text-xs text-gray-500 mb-2">
                Compressed Size: {(compressedBlob.size / 1024).toFixed(2)} KB
              </p>
            )}
            <img
              src={compressed}
              alt="Compressed"
              className="rounded-lg max-h-64 mx-auto mb-4 object-contain"
            />
            <a
              href={compressed}
              download="compressed.jpg"
              className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
            >
              Download Image
            </a>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default ImageCompressor;