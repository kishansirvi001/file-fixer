import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App password (NOT your real password)
  },
});

// POST /api/sendEmail
router.post("/sendEmail", async (req, res) => {
  try {
    const { email } = req.body;

    // ✅ Validate email
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // ✅ Email content
    const mailOptions = {
      from: `"FileFixer" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to FileFixer 🚀",
      html: `
        <h2>Welcome to FileFixer 🚀</h2>
        <p>Thanks for joining! You'll get updates on new tools.</p>
        <br/>
        <p>— Team FileFixer</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully" });

  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

export default router;
