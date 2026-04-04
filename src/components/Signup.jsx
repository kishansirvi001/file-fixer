// src/components/Signup.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE } from "../config"; // This should point to localhost in dev, Render URL in prod

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    dob: "",
    gender: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/welcome";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, email: form.email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      if (!data.token) {
        setError("No token received from server");
        setLoading(false);
        return;
      }

      // Store auth token and user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user || { name: form.name }));

      // Redirect back to the page user came from or welcome
      navigate(from, { replace: true });

    } catch (err) {
      setError("Server not responding. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden px-4">

      {/* Background Blobs */}
      <div className="absolute w-72 h-72 bg-pink-400 rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-indigo-400 rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse"></div>

      {/* Glass Card */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md text-white relative z-10">
        <h2 className="text-3xl font-bold text-center mb-6 drop-shadow-lg">
          Create Account 🚀
        </h2>

        {error && (
          <p className="text-red-300 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required
            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-pink-400" />

          <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required
            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-pink-400" />

          <input type="tel" name="mobile" placeholder="Mobile Number" value={form.mobile} onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-pink-400" />

          <input type="date" name="dob" value={form.dob} onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-pink-400" />

          <select name="gender" value={form.gender} onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-pink-400">
            <option value="" className="text-black">Select Gender</option>
            <option value="male" className="text-black">Male</option>
            <option value="female" className="text-black">Female</option>
            <option value="other" className="text-black">Other</option>
          </select>

          <div className="relative">
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={form.password} onChange={handleChange} required
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-pink-400" />
            <span className="absolute right-3 top-2 cursor-pointer text-sm text-white/80"
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button type="submit" disabled={loading || !form.email || !form.password}
            className="w-full bg-gradient-to-r from-pink-500 to-indigo-500 text-white py-2 rounded-lg font-semibold hover:scale-105 transition duration-200 disabled:opacity-50">
            {loading ? "Creating Account..." : "Signup"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-white/80">
          Already have an account?{" "}
          <span className="text-pink-300 cursor-pointer font-medium hover:underline"
            onClick={() => navigate("/login", { state: { from: location.state?.from } })}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}