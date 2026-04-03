// Nodemon Trigger - Port Fix
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import connectDB from "./config/db.js";
import authRoutes from "./Routes/authRoutes.js";
import policyRoutes from "./Routes/policyRoutes.js";
import applicationRoutes from "./Routes/applicationRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import dashboardRoutes from "./Routes/dashboardRoutes.js";
import chatRoutes from "./Routes/chatRoutes.js";

dotenv.config({ override: true });
console.log("Loading environment variables...");
console.log("MONGO_URI starting with:", process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 20) + "..." : "undefined");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(compression());

// Updated CORS to support your CLIENT_URL dynamically
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}));

app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/chat", chatRoutes);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error(`Error starting server: ${error.message}`);
        process.exit(1);
    }
};

startServer();
