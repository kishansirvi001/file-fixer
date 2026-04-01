import { useState } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaArrowUp } from "react-icons/fa";

function Footer() {
  const [email, setEmail] = useState("");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleJoin = async () => {
    if (!email) return alert("Please enter your email!");

    try {
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        alert("Thanks! Email sent to your inbox.");
        setEmail("");
      } else {
        alert("Failed to send email. Check server logs.");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending email.");
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 relative">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-10">
        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">🚀 FileFixer</h2>
          <p className="text-sm mb-4">Fast, secure & free PDF tools — compress, convert, merge and more.</p>
          <div className="text-xs text-gray-400 space-y-1 mb-4">
            <p>🔒 100% Secure</p>
            <p>📁 No File Storage</p>
            <p>⚡ Instant Processing</p>
          </div>
          <div className="flex gap-4 text-xl mt-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition hover:scale-110"><FaGithub /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition hover:scale-110"><FaLinkedin /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition hover:scale-110"><FaTwitter /></a>
            <a href="https://instagram.com/kishansirvi_" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition hover:scale-110"><FaInstagram /></a>
          </div>
        </div>

        {/* PDF Tools */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">PDF Tools</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/compress-pdf" className="hover:text-white transition">Compress PDF</Link></li>
            <li><Link to="/merge-pdf" className="hover:text-white transition">Merge PDF</Link></li>
            <li><Link to="/split-pdf" className="hover:text-white transition">Split PDF</Link></li>
            <li><Link to="/pdf-to-word" className="hover:text-white transition">PDF to Word</Link></li>
          </ul>
        </div>

        {/* Convert Tools */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Convert Tools</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/jpg-to-pdf" className="hover:text-white transition">JPG to PDF</Link></li>
            <li><Link to="/png-to-pdf" className="hover:text-white transition">PNG to PDF</Link></li>
            <li><Link to="/pdf-to-jpg" className="hover:text-white transition">PDF to JPG</Link></li>
            <li><Link to="/pdf-to-png" className="hover:text-white transition">PDF to PNG</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
          <p className="text-sm mb-4">Get updates on new tools 🚀</p>
          <div className="flex overflow-hidden rounded-lg">
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-black focus:outline-none"
            />
            <button onClick={handleJoin} className="bg-indigo-600 px-4 text-white hover:bg-indigo-700 transition">Join</button>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <button onClick={scrollToTop} className="absolute right-6 bottom-16 bg-indigo-600 p-3 rounded-full text-white shadow-lg hover:bg-indigo-700 transition">
        <FaArrowUp />
      </button>

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} FileFixer • All rights reserved
      </div>
    </footer>
  );
}

export default Footer;