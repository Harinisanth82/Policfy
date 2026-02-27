import User from "../Models/User.js";
import Policy from "../Models/Policy.js";
import Application from "../Models/Application.js";


export const getUserDashboardStats = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Fetch all applications for the user
        const applications = await Application.find({ userId });

        // Fetch all policies to calculate total active policies count
        // The user dashboard shows "Active Policies" as a general stat of available policies in the system
        const policies = await Policy.find();

        const appliedCount = applications.length;
        const approvedCount = applications.filter(app => app.status === 'Approved').length;
        const pendingCount = applications.filter(app => app.status === 'Pending').length;
        const policyCount = policies.length;

        // Structure the response to match what the frontend expects
        const stats = [
            {
                title: 'Active Policies',
                value: policyCount,
                iconType: 'DescriptionRounded',
                color: '#2196F3',
                borderColor: '#2196F3'
            },
            {
                title: 'Policies Applied',
                value: appliedCount,
                iconType: 'AssignmentRounded',
                color: '#9C27B0',
                borderColor: '#9C27B0'
            },
            {
                title: 'Approved Applications',
                value: approvedCount,
                iconType: 'CheckCircleRounded',
                color: '#4CAF50',
                borderColor: '#4CAF50'
            },
            {
                title: 'Pending Applications',
                value: pendingCount,
                iconType: 'AccessTimeRounded',
                color: '#EF5350',
                borderColor: '#EF5350'
            },
        ];

        res.status(200).json(stats);
    } catch (err) {
        next(err);
    }
};

export const getAdminDashboardStats = async (req, res, next) => {

    try {
        const [users, policies, applications] = await Promise.all([
            User.find(),
            Policy.find(),
            Application.find().populate('policyId', 'title')
        ]);

        // Calculate Stats
        const totalUsers = users.length;
        const totalPolicies = policies.length;
        const activePolicies = policies.filter(p => p.isActive).length;
        const pendingApps = applications.filter(a => a.status === 'Pending').length;

        const stats = [
            { label: 'Total Users', value: totalUsers, iconType: 'GroupRounded', color: '#5B86E5' },
            { label: 'Total Policies', value: totalPolicies, iconType: 'DescriptionRounded', color: '#be1adb' },
            { label: 'Active Policies', value: activePolicies, iconType: 'CheckCircleRounded', color: '#00ff6a' },
            { label: 'Pending Apps', value: pendingApps, iconType: 'AccessTimeRounded', color: '#ef5350' },
        ];

        // Create recent activity from applications (latest 4)
        const sortedApps = [...applications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);

        const recentActivity = sortedApps.map(app => ({
            title: `New application for ${app.policyId?.title || 'Policy'}`,
            time: new Date(app.createdAt).toLocaleDateString(),
            color: '#be1adb',
            iconType: 'NotificationsRounded'
        }));

        // Calculate Activity Trend (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1); // Start from the 1st of that month

        const monthlyData = await Application.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // Format data for frontend (ensure all 6 months are present)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const activityData = [];

        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - (5 - i));
            const monthIndex = d.getMonth();
            const year = d.getFullYear();

            const found = monthlyData.find(item => item._id.month === (monthIndex + 1) && item._id.year === year);

            activityData.push({
                label: months[monthIndex],
                value: found ? found.count : 0
            });
        }

        res.status(200).json({ stats, recentActivity, activityData });
    } catch (err) {
        next(err);
    }
};
