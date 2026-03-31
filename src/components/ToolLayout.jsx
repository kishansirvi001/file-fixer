import React, { useRef, useState, useEffect } from "react";

export default function ToolLayout({ title, children }) {
  const containerRef = useRef(null);
  const [height, setHeight] = useState("auto");

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setHeight(containerRef.current.scrollHeight + "px");
      }
    };

    updateHeight(); // initial measurement

    // Re-measure on window resize
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, [children]);

  return (
    <div className="p-4">
      {/* Page Title */}
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      {/* Tool Card Container */}
      <div
        className="bg-white shadow-lg rounded-2xl p-6 transition-[height] duration-500 flex flex-col"
        style={{ height }}
      >
        <div ref={containerRef}>{children}</div>
      </div>
    </div>
  );
}