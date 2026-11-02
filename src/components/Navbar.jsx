import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-[#e5322d]">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#e5322d] text-sm text-white">F</span>
          FileFixer
        </Link>
        <div className="hidden items-center gap-8 text-sm font-semibold text-gray-700 md:flex">
          <Link to="/" className="hover:text-[#e5322d]">All tools</Link>
          <Link to="/pdf-to-word" className="hover:text-[#e5322d]">PDF to Word</Link>
          <Link to="/jpg-to-pdf" className="hover:text-[#e5322d]">JPG to PDF</Link>
          <Link to="/pdf-merge" className="hover:text-[#e5322d]">Merge PDF</Link>
          <Link to="/pdf-compressor" className="hover:text-[#e5322d]">Compress PDF</Link>
        </div>
        <Link to="/" className="text-sm font-semibold text-gray-600 hover:text-[#e5322d] md:hidden">All tools</Link>
      </div>
    </nav>
  );
}

export default Navbar;
