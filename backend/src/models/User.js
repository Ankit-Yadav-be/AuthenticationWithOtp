// src/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    dob: { type: Date, required: true }, // ✅ DOB field

    email: { type: String, required: true, unique: true },

    googleId: { type: String }, // for Google login

    otp: { type: String }, // OTP for verification
    otpExpiry: { type: Date }, // OTP expiry time

    isVerified: { type: Boolean, default: false }, // after OTP verification
  },
  { timestamps: true }
);

// Password hash middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (!this.password) return next(); // in case of Google login
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password match method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
