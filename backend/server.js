
import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.get("/", (req, res) => {
  res.send(" API is running...");
});

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(` Server running on port ${process.env.PORT || 5000}`);
});
