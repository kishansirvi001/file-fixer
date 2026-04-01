import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";

function Home() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState([]);

  // 🔥 TOOL DATA
  const tools = [
    {
  title: "Scan to PDF",
  icon: "📷",
  desc: "Capture document using camera and convert to PDF",
  link: "/scan-to-pdf",
  popular: true
},
    {
  title: "Merge PDF",
  icon: "📎",
  desc: "Combine multiple PDF files into one.",
  link: "/merge-pdf",
  popular: true,
  users: "1.3M+ users",
  category: "to-pdf",
},
{
  title: "ZIP to PDF",
  icon: "🗂️",
  desc: "Convert images inside ZIP into a single PDF.",
  link: "/zip-to-pdf",
  popular: false,
  users: "800K+ users",
  category: "to-pdf",
},
{
  title: "PDF to Word",
  icon: "📄",
  desc: "Convert PDF into editable Word file.",
  link: "/pdf-to-word",
  popular: true,
  users: "1.6M+ users",
  category: "from-pdf",
},
    {
      title: "Unlock PDF",
      icon: "🔓",
      desc: "Remove password protection from PDF files easily.",
      link: "/unlock-pdf",
      popular: true,
      users: "900K+ users",
      category: "security",
    },
    {
      title: "Protect PDF",
      icon: "🔒",
      desc: "Add password protection to your PDF files securely.",
      link: "/protect-pdf",
      popular: true,
      users: "1.1M+ users",
      category: "security",
    },
    {
      title: "PDF to PNG",
      icon: "🖼️",
      desc: "Convert PDF pages into PNG images.",
      link: "/pdf-to-png",
      popular: false,
      users: "500K+ users",
      category: "from-pdf",
    },
    {
      title: "PDF To Excel",
      icon: "📊",
      desc: "Convert PDF tables into Excel.",
      link: "/pdf-to-excel",
      popular: true,
      users: "1.5M+ users",
      category: "from-pdf",
    },
    {
      title: "PDF To JPG",
      icon: "🖼️",
      desc: "Convert PDF pages into JPG.",
      link: "/pdf-to-jpg",
      popular: true,
      users: "1.8M+ users",
      category: "from-pdf",
    },
    {
      title: "JPG to PDF",
      icon: "📄",
      desc: "Convert images into PDF.",
      link: "/jpg-to-pdf",
      popular: true,
      users: "1.2M+ users",
      category: "to-pdf",
    },
    {
      title: "PNG to PDF",
      icon: "🖼️",
      desc: "Convert PNG into PDF.",
      link: "/png-to-pdf",
      popular: false,
      users: "600K+ users",
      category: "to-pdf",
    },
    {
      title: "Word to PDF",
      icon: "📄",
      desc: "Convert Word to PDF.",
      link: "/word-to-pdf",
      popular: false,
      users: "600K+ users",
      category: "to-pdf",
    },
    {
      title: "Image to Text (OCR)",
      icon: "📝",
      desc: "Extract text from images.",
      link: "/image-to-text",
      popular: false,
      users: "720K+ users",
      category: "ocr",
    },
    {
      title: "PDF to Text",
      icon: "📝",
      desc: "Extract text from PDF.",
      link: "/pdf-to-text",
      popular: false,
      users: "650K+ users",
      category: "ocr",
    },
    {
      title: "Image Compressor",
      icon: "🖼️",
      desc: "Reduce image size.",
      link: "/compress-image",
      popular: true,
      users: "980K+ users",
      category: "compress",
    },
    {
      title: "PDF Compressor",
      icon: "🗜️",
      desc: "Reduce PDF size.",
      link: "/compress-pdf",
      popular: true,
      users: "1.5M+ users",
      category: "compress",
    },
  ];

  // 🔥 DEBOUNCE SEARCH
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // 🔥 LOAD LOCAL STORAGE
  useEffect(() => {
    setFavorites(JSON.parse(localStorage.getItem("favorites")) || []);
    setRecent(JSON.parse(localStorage.getItem("recent")) || []);
  }, []);

  // 🔥 FAVORITE TOGGLE
  const toggleFavorite = (title) => {
    let updated;
    if (favorites.includes(title)) {
      updated = favorites.filter((f) => f !== title);
    } else {
      updated = [...favorites, title];
    }
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // 🔥 TRACK RECENT
  const handleClick = (tool) => {
    let updated = [tool, ...recent.filter((t) => t.title !== tool.title)];
    updated = updated.slice(0, 5);
    setRecent(updated);
    localStorage.setItem("recent", JSON.stringify(updated));
  };

  // 🔥 FILTER + SEARCH
  const filteredTools = tools.filter((tool) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "popular"
        ? tool.popular
        : tool.category === filter;

    const matchesSearch = tool.title
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      <HeroSection />

      <section className="max-w-6xl mx-auto px-6 py-20">
        {/* TITLE */}
        <h2 className="text-4xl font-bold text-center text-indigo-700">
          Our Tools
        </h2>

        <p className="text-center text-gray-500 mt-3">
          Fast, secure & powerful file tools
        </p>

        {/* SEARCH */}
        <div className="flex justify-center mt-8">
          <input
            type="text"
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-5 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-400 shadow"
          />
        </div>

        {/* FILTER */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {[
            "all",
            "popular",
            "from-pdf",
            "to-pdf",
            "ocr",
            "security",
            "compress",
          ].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === type
                  ? "bg-indigo-600 text-white scale-105"
                  : "bg-white border hover:bg-indigo-50"
              }`}
            >
              {
                {
                  all: "🌐 All",
                  popular: "🔥 Popular",
                  "from-pdf": "📤 From PDF",
                  "to-pdf": "📥 To PDF",
                  ocr: "🧠 OCR",
                  security: "🔐 Security",
                  compress: "🗜️ Compress",
                }[type]
              }
            </button>
          ))}
        </div>

        {/* RECENT */}
        {recent.length > 0 && (
          <div className="mt-14">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Recently Used
            </h3>
            <div className="flex gap-4 flex-wrap">
              {recent.map((tool, i) => (
                <Link key={i} to={tool.link}>
                  <div className="px-4 py-2 bg-white rounded-lg shadow text-sm hover:bg-indigo-50">
                    {tool.icon} {tool.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool, index) => (
              <Link
                key={index}
                to={tool.link}
                onClick={() => handleClick(tool)}
              >
                <div
                  className="group relative bg-white/70 backdrop-blur-lg p-7 rounded-2xl shadow-md border hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* FAVORITE */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(tool.title);
                    }}
                    className="absolute top-4 left-4 text-lg"
                  >
                    {favorites.includes(tool.title) ? "⭐" : "☆"}
                  </button>

                  {/* POPULAR */}
                  {tool.popular && (
                    <div className="absolute top-4 right-4 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                      Popular
                    </div>
                  )}

                  {/* ICON */}
                  <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-indigo-100 text-2xl mb-4 group-hover:scale-110 transition">
                    {tool.icon}
                  </div>

                  <h3 className="text-xl font-semibold text-indigo-700">
                    {tool.title}
                  </h3>

                  <p className="text-gray-500 mt-2 text-sm">
                    {tool.desc}
                  </p>

                  <div className="mt-4 text-xs text-gray-400">
                    {tool.users}
                  </div>

                  {/* CTA */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition">
                    <span className="text-indigo-600 text-sm font-semibold">
                      Use Tool →
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 flex flex-col items-center">
              <div className="text-5xl mb-2">😢</div>
              <p className="text-gray-500">No tools found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;