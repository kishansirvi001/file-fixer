import React from "react";
import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-white to-indigo-50 py-24">
      <div className="max-w-4xl mx-auto text-center px-6">
        
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
          All-in-One PDF & Image Tools
        </h1>

        {/* Subheading */}
        <p className="text-gray-600 text-lg md:text-xl mb-10">
          Compress, Convert, Merge, and Edit your files quickly and securely — all in one place.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/merge-pdf"
            className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
          >
            Merge PDFs
          </Link>

          <Link
            to="/compress-image"
            className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
          >
            Compress Images
          </Link>
        </div>

      </div>
    </section>
  );
}

export default HeroSection;