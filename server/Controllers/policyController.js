import Policy from "../Models/Policy.js";
import { analyzePolicy, generateDynamicForm } from "../utils/groqAnalyzer.js";

// Add new policy (Admin)
export const addPolicy = async (req, res) => {
    try {
        const policy = new Policy(req.body);
        await policy.save();
        res.json({ message: "Policy added successfully", policy });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all policies (User & Admin)
export const getPolicies = async (req, res) => {
    try {
        const policies = await Policy.find();
        res.json(policies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single policy by ID (Admin)
export const getPolicyById = async (req, res) => {
    try {
        const policy = await Policy.findById(req.params.id);
        if (!policy) {
            return res.status(404).json({ message: "Policy not found" });
        }
        res.json(policy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update policy (Admin)
export const updatePolicy = async (req, res) => {
    try {
        const policy = await Policy.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!policy) {
            return res.status(404).json({ message: "Policy not found" });
        }
        res.json({ message: "Policy updated successfully", policy });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete policy (Admin)
export const deletePolicy = async (req, res) => {
    try {
        await Policy.findByIdAndDelete(req.params.id);
        res.json({ message: "Policy deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Analyze policy
export const analyzePolicyController = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: "Policy ID is required" });
        }

        const policy = await Policy.findById(id);
        if (!policy) {
            return res.status(404).json({ message: "Policy not found" });
        }

        const analysis = await analyzePolicy(policy.description);

        if (policy.analysis && policy.analysis.risk && !req.body.forceReanalyze) {
            // Usually we'd return cached but req asks to save it.
        }

        policy.analysis = analysis;
        await policy.save();

        res.json(analysis);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Generate Dynamic Form
export const generateFormController = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ message: "Policy title and description are required" });
        }
        
        const fields = await generateDynamicForm(title, description);
        res.json({ fields });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
