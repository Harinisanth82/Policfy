import express from "express";
import { getUserDashboardStats, getAdminDashboardStats } from "../Controllers/dashboardController.js";
import { protect, admin } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/user-stats", protect, getUserDashboardStats);
router.get("/admin-stats", protect, admin, getAdminDashboardStats);

export default router;
