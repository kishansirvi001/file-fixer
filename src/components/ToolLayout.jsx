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

    updateHeight();

    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [children]);

  return (
    <div className="p-3 sm:p-4">
      
      {/* Title */}
      <h2 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-6">
        {title}
      </h2>

      {/* Container */}
      <div
        className="
          bg-white 
          shadow-md sm:shadow-lg 
          rounded-xl sm:rounded-2xl 
          p-3 sm:p-6 
          transition-[height] duration-300
          flex flex-col
        "
        style={{ height }}
      >
        <div ref={containerRef}>{children}</div>
      </div>
    </div>
  );
}