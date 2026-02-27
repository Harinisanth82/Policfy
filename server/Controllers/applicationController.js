import Application from "../Models/Application.js";

// Apply for policy
export const applyPolicy = async (req, res) => {
    try {
        const application = new Application({
            userId: req.body.userId,
            policyId: req.body.policyId
        });

        // Check if application already exists
        const existingApplication = await Application.findOne({
            userId: req.body.userId,
            policyId: req.body.policyId
        });

        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this policy" });
        }

        await application.save();
        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user applications
export const getUserApplications = async (req, res) => {
    try {
        const apps = await Application.find({ userId: req.params.userId })
            .populate("policyId");

        res.json(apps);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all applications (Admin)
export const getAllApplications = async (req, res) => {
    try {
        const apps = await Application.find()
            .populate("userId", "name email") // userId from schema
            .populate("policyId", "title category"); // policyId from schema
        res.json(apps);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update application status (Admin)
export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )
            .populate("userId", "name email")
            .populate("policyId", "title category");
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete application (User)
export const deleteApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        // Authorization check: Ensure user is the owner
        if (application.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to cancel this application" });
        }

        // Only allow deletion if status is pending
        const currentStatus = application.status.toLowerCase();
        if (currentStatus !== 'pending') {
            return res.status(400).json({
                message: `Cannot delete an application that has already been ${currentStatus}`
            });
        }

        await application.deleteOne();
        res.json({ message: "Application deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
