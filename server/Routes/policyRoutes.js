import express from "express";
import {
    addPolicy,
    getPolicies,
    getPolicyById,
    updatePolicy,
    deletePolicy
} from "../Controllers/policyController.js";
import { protect, admin } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, admin, addPolicy);
router.get("/", protect, getPolicies);
router.get("/:id", protect, getPolicyById);
router.put("/:id", protect, admin, updatePolicy);
router.delete("/:id", protect, admin, deletePolicy);

export default router;
