import express from "express";
import multer from "multer";
import cors from "cors";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

if (!fs.existsSync("outputs")) fs.mkdirSync("outputs");

app.post("/pdf-to-word", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  const inputPath = path.resolve(req.file.path);
  const outputDir = path.resolve("outputs");

  const outputFileName = req.file.originalname.replace(/\.pdf$/i, ".docx");
  const outputPath = path.join(outputDir, outputFileName);

  console.log("Converting PDF to Word...");
  console.log("Input:", inputPath);
  console.log("Output:", outputPath);

  // Use full path to LibreOffice if needed
  const sofficeCmd = "soffice"; // replace with full path on Windows if necessary

  const command = `"${sofficeCmd}" --headless --convert-to docx --outdir "${outputDir}" "${inputPath}"`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("Conversion Error:", err);
      console.error(stderr);
      try { fs.unlinkSync(inputPath); } catch {}
      return res.status(500).send("PDF → Word conversion failed");
    }

    if (!fs.existsSync(outputPath)) {
      console.error("Output file not found:", outputPath);
      return res.status(500).send("Conversion failed: output missing");
    }

    res.download(outputPath, outputFileName, (err) => {
      try { fs.unlinkSync(inputPath); fs.unlinkSync(outputPath); } catch {}
      if (err) console.error(err);
    });
  });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));