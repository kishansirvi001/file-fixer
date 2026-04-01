import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS, // Gmail App Password
    },
  });

  try {
    await transporter.sendMail({
      from: `"FileFixer" <${process.env.GMAIL_USER}>`,
      to: process.env.MY_EMAIL,
      subject: "New subscription",
      text: `New user subscribed with email: ${email}`,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email" });
  }
}