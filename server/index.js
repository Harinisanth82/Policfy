import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./Routes/authRoutes.js";
import policyRoutes from "./Routes/policyRoutes.js";
import applicationRoutes from "./Routes/applicationRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import dashboardRoutes from "./Routes/dashboardRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



// routes
app.use("/api/auth", authRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

connectDB();

app.listen(PORT, () => { });
