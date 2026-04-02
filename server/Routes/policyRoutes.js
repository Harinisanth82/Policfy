import express from "express";
import {
    addPolicy,
    getPolicies,
    getPolicyById,
    updatePolicy,
    deletePolicy,
    analyzePolicyController,
    generateFormController
} from "../Controllers/policyController.js";
import { protect, admin } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, admin, addPolicy);
router.get("/", protect, getPolicies);
router.get("/:id", protect, getPolicyById);
router.put("/:id", protect, admin, updatePolicy);
router.delete("/:id", protect, admin, deletePolicy);
router.post("/analyze", protect, analyzePolicyController);
router.post("/generate-form", protect, generateFormController);

export default router;
