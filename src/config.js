// src/config.js

// Use environment variable if available, otherwise fallback to local
const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export { API_BASE };