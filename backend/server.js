import express from "express";
import multer from "multer";
import cors from "cors";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(cors());
app.use(express.json());

// Ensure folders exist
["uploads", "outputs", "temp"].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

// Multer setup with unique filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Route: PDF → Word via ODT
app.post("/pdf-to-word", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded");
    if (req.file.mimetype !== "application/pdf") {
      fs.unlinkSync(req.file.path);
      return res.status(400).send("Only PDF files are allowed");
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

    // Step 1: PDF → ODT
    const pdfToOdtCmd = `${sofficeCmd} --headless --convert-to odt --outdir "${tempDir}" "${inputPath}"`;
    console.log("🔄 Converting PDF → ODT:", pdfToOdtCmd);

    exec(pdfToOdtCmd, (err, stdout, stderr) => {
      console.log("📄 stdout:", stdout);
      console.log("📄 stderr:", stderr);

      if (err || !fs.existsSync(odtPath)) {
        console.error("❌ PDF → ODT conversion failed", err);
        try { fs.unlinkSync(inputPath); } catch {}
        return res.status(500).send("PDF → ODT conversion failed");
      }

      console.log("✅ PDF → ODT complete:", odtPath);

      // Step 2: ODT → DOCX
      const odtToDocxCmd = `${sofficeCmd} --headless --convert-to docx --outdir "${outputDir}" "${odtPath}"`;
      console.log("🔄 Converting ODT → DOCX:", odtToDocxCmd);

      exec(odtToDocxCmd, (err2, stdout2, stderr2) => {
        console.log("📄 stdout:", stdout2);
        console.log("📄 stderr:", stderr2);

        // Cleanup input PDF & temp ODT
        try { fs.unlinkSync(inputPath); } catch {}
        try { fs.unlinkSync(odtPath); } catch {}

        if (err2 || !fs.existsSync(finalDocxPath)) {
          console.error("❌ ODT → DOCX conversion failed", err2);
          return res.status(500).send("ODT → DOCX conversion failed");
        }

        console.log("✅ Conversion complete:", finalDocxPath);

        // Send DOCX to client
        res.download(finalDocxPath, `${baseName}.docx`, (err3) => {
          if (err3) console.error("Download error:", err3);
          try { fs.unlinkSync(finalDocxPath); } catch {}
        });
      });
    });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).send("Internal server error");
  }
});

// Health check
app.get("/", (req, res) => res.send("PDF to Word API running 🚀"));

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));