// src/config.js

const dev = process.env.NODE_ENV !== "production";

export const API_BASE = dev
  ? "http://localhost:5000" // Local backend for development
  : "https://file-fixer.onrender.com" // Replace with your Render backend URL