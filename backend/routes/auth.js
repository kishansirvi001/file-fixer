import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Helper to generate JWT
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ✅ SIGNUP
router.post("/signup", async (req, res) => {
  try {
    console.log("📥 Signup BODY:", req.body);

    const { name, email, password, mobile, dob, gender } = req.body;

    // ✅ Validation
    if (!name || !email || !password || !dob || !gender) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    // ✅ Check existing user (EMAIL OR MOBILE)
    console.log("🔍 Checking existing user...");
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already registered" });
      }
      if (existingUser.mobile === mobile) {
        return res.status(400).json({ message: "Mobile number already registered" });
      }
    }

    // ✅ Hash password
    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    console.log("📝 Creating user...");
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      dob,
      gender,
    });

    // ✅ Generate token
    console.log("🎟 Generating token...");
    const token = generateToken(user._id);

    console.log("✅ Signup success");

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        dob: user.dob,
        gender: user.gender,
      },
    });

  } catch (err) {
    console.error("❌ SIGNUP ERROR FULL:", err);

    // ✅ Handle duplicate key error (MongoDB safety)
    if (err.code === 11000) {
      if (err.keyPattern?.email) {
        return res.status(400).json({ message: "Email already exists" });
      }
      if (err.keyPattern?.mobile) {
        return res.status(400).json({ message: "Mobile already exists" });
      }
    }

    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log("📥 Login BODY:", req.body);

    const { email, password } = req.body;

    // ✅ Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    // ✅ Find user
    console.log("🔍 Finding user...");
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // ✅ Check password
    console.log("🔐 Comparing password...");
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // ✅ Generate token
    console.log("🎟 Generating token...");
    const token = generateToken(user._id);

    console.log("✅ Login success");

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        dob: user.dob,
        gender: user.gender,
      },
    });

  } catch (err) {
    console.error("❌ LOGIN ERROR FULL:", err);

    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

export default router;