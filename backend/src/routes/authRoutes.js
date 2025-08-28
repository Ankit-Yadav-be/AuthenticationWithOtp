import express from "express";
import {
  signup,
  verifySignupOtp,
  login,
  verifyLoginOtp,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-signup-otp", verifySignupOtp);

router.post("/login", login);
router.post("/verify-login-otp", verifyLoginOtp);

export default router;
