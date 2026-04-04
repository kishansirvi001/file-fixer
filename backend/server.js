// server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import multer from "multer";
import { exec } from "child_process";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();

// ================= CORS (FINAL FIX) =================
app.use(cors()); // ✅ simplest & most reliable

// Manual headers (extra safety for Render + Vercel)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // ✅ handle preflight
  }

  next();
});

// ================= MIDDLEWARE =================
app.use(express.json());

// ================= ROUTES =================
app.use("/api/auth", authRoutes);

// ================= AUTH MIDDLEWARE =================
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch {
    return res.status(401).json({ message: "Token expired or invalid" });
  }
};

// ================= DATABASE =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ================= FOLDERS =================
["uploads", "outputs", "temp"].forEach((dir) => {
  const fullPath = path.resolve(dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// ================= MULTER =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, uuidv4() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// ================= PDF → WORD =================
app.post("/pdf-to-word", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded");

    if (req.file.mimetype !== "application/pdf") {
      fs.unlinkSync(req.file.path);
      return res.status(400).send("Only PDF files allowed");
    }

    const inputPath = path.resolve(req.file.path);
    const tempDir = path.resolve("temp");
    const outputDir = path.resolve("outputs");

    const baseName = path.basename(req.file.filename, ".pdf");
    const odtPath = path.join(tempDir, `${baseName}.odt`);
    const finalDocxPath = path.join(outputDir, `${baseName}.docx`);

    const sofficeCmd =
      process.platform === "win32"
        ? `"C:\\Program Files\\LibreOffice\\program\\soffice.exe"`
        : "soffice";

    exec(
      `${sofficeCmd} --headless --convert-to odt --outdir "${tempDir}" "${inputPath}"`,
      (err) => {
        if (err || !fs.existsSync(odtPath)) {
          try { fs.unlinkSync(inputPath); } catch {}
          return res.status(500).send("PDF → ODT conversion failed");
        }

        exec(
          `${sofficeCmd} --headless --convert-to docx --outdir "${outputDir}" "${odtPath}"`,
          (err2) => {
            try { fs.unlinkSync(inputPath); } catch {}
            try { fs.unlinkSync(odtPath); } catch {}

            if (err2 || !fs.existsSync(finalDocxPath)) {
              return res.status(500).send("ODT → DOCX conversion failed");
            }

            res.download(finalDocxPath, `${baseName}.docx`, (err3) => {
              try { fs.unlinkSync(finalDocxPath); } catch {}
              if (err3) console.error(err3);
            });
          }
        );
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// ================= HEALTH =================
app.get("/", (req, res) => {
  res.send("🚀 Server running with Auth & Protected Routes");
});

// ================= START =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});