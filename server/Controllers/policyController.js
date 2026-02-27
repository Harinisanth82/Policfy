import Policy from "../Models/Policy.js";

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
