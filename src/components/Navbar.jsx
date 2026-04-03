import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  // 🔥 Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-700">
          FileFixer
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 relative">

          <Link to="/" className="hover:text-indigo-600 transition">
            Home
          </Link>

          {/* From PDF */}
          <div className="relative">
            <button onClick={() => toggleDropdown("from")} className="hover:text-indigo-600">
              From PDF ⌄
            </button>

            {activeDropdown === "from" && (
              <div className="absolute top-10 left-0 bg-white shadow-lg rounded-xl p-4 w-48 space-y-2">
                <Link to="/pdf-to-jpg" className="block hover:text-indigo-600">PDF to JPG</Link>
                <Link to="/pdf-to-word" className="block hover:text-indigo-600">PDF to Word</Link>
                <Link to="/pdf-to-excel" className="block hover:text-indigo-600">PDF to Excel</Link>
              </div>
            )}
          </div>

          {/* To PDF */}
          <div className="relative">
            <button onClick={() => toggleDropdown("to")} className="hover:text-indigo-600">
              To PDF ⌄
            </button>

            {activeDropdown === "to" && (
              <div className="absolute top-10 left-0 bg-white shadow-lg rounded-xl p-4 w-48 space-y-2">
                <Link to="/jpg-to-pdf" className="block hover:text-indigo-600">JPG to PDF</Link>
                <Link to="/word-to-pdf" className="block hover:text-indigo-600">Word to PDF</Link>
                <Link to="/excel-to-pdf" className="block hover:text-indigo-600">Excel to PDF</Link>
              </div>
            )}
          </div>

          {/* PDF Security */}
          <div className="relative">
            <button onClick={() => toggleDropdown("security")} className="hover:text-indigo-600">
              PDF Security ⌄
            </button>

            {activeDropdown === "security" && (
              <div className="absolute top-10 left-0 bg-white shadow-lg rounded-xl p-4 w-48 space-y-2">
                <Link to="/protect-pdf" className="block hover:text-indigo-600">Protect PDF</Link>
                <Link to="/unlock-pdf" className="block hover:text-indigo-600">Unlock PDF</Link>
                <Link to="/merge-pdf" className="block hover:text-indigo-600">Merge PDF</Link>
              </div>
            )}
          </div>

          {/* OCR */}
          <Link to="/image-to-text" className="hover:text-indigo-600 transition">
            Scan PDF (OCR)
          </Link>

          {/* 🔥 Auth Buttons */}
          <div className="ml-4">
            {token ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="mr-3 hover:text-indigo-600"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700"
                >
                  Signup
                </button>
              </>
            )}
          </div>

        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-6 space-y-4 bg-white border-t">

          <Link to="/" className="block">Home</Link>

          <p className="text-gray-500">From PDF</p>
          <Link to="/pdf-to-jpg" className="block">PDF to JPG</Link>
          <Link to="/pdf-to-word" className="block">PDF to Word</Link>
          <Link to="/pdf-to-excel" className="block">PDF to Excel</Link>

          <p className="text-gray-500 mt-3">To PDF</p>
          <Link to="/jpg-to-pdf" className="block">JPG to PDF</Link>
          <Link to="/word-to-pdf" className="block">Word to PDF</Link>
          <Link to="/excel-to-pdf" className="block">Excel to PDF</Link>

          <p className="text-gray-500 mt-3">PDF Security</p>
          <Link to="/protect-pdf" className="block">Protect PDF</Link>
          <Link to="/unlock-pdf" className="block">Unlock PDF</Link>
          <Link to="/merge-pdf" className="block">Merge PDF</Link>

          <Link to="/image-to-text" className="block mt-3">
            Scan PDF (OCR)
          </Link>

          {/* 🔥 Mobile Auth */}
          <div className="mt-4">
            {token ? (
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-2 rounded-lg"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="block w-full mb-2"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg"
                >
                  Signup
                </button>
              </>
            )}
          </div>

        </div>
      )}
    </nav>
  );
}

export default Navbar;