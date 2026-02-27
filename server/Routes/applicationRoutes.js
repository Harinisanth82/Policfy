import express from "express";
import {
    applyPolicy,
    getUserApplications,
    getAllApplications,
    updateApplicationStatus,
    deleteApplication
} from "../Controllers/applicationController.js";
import { protect, admin } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", protect, applyPolicy);
router.get("/user/:userId", protect, getUserApplications);
router.get("/", protect, admin, getAllApplications);
router.put("/:id/status", protect, admin, updateApplicationStatus);
router.delete("/:id", protect, deleteApplication);

export default router;
