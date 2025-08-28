// src/controllers/authController.js
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { generateOtp, sendOtp } from "../utils/sendOtp.js";

// =================== SIGNUP ===================

// @desc Signup user (send OTP)
// @route POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { name, email, dob } = req.body;

    if (!name || !email || !dob) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = generateOtp();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 min

    if (user) {
      user.name = name;
      user.dob = dob;
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    } else {
      user = await User.create({
        name,
        email,
        dob,
        otp,
        otpExpiry,
        isVerified: false,
      });
    }

    await sendOtp(email, otp);

    res.status(200).json({
      message: "OTP sent to email for signup verification",
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Verify Signup OTP
// @route POST /api/auth/verify-signup-otp
export const verifySignupOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({
      message: "Signup successful",
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, dob: user.dob },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =================== LOGIN ===================

// @desc Login request (send OTP)
// @route POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.isVerified) {
      return res.status(400).json({ message: "User not verified" });
    }

    const otp = generateOtp();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOtp(email, otp);

    res.status(200).json({
      message: "OTP sent to email for login",
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Verify Login OTP
// @route POST /api/auth/verify-login-otp
export const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, dob: user.dob },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
