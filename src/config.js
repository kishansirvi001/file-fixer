// src/config.js

// Always use environment variable (works for both dev + production)
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export { API_BASE };