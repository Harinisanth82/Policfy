import User from '../Models/User.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id);
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            // Prevent deleting the super admin
            if (user.email === 'admin@example.com') {
                return res.status(403).json({ message: 'Cannot delete super admin user' });
            }

            // Prevent self-deletion
            if (req.user._id.toString() === req.params.id) {
                return res.status(403).json({ message: 'You cannot delete your own account' });
            }

            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new admin
// @route   POST /api/users/admin
// @access  Private/Admin
export const createAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    try {
        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate a name from the email (e.g., admin@test.com -> admin)
        const name = email.split('@')[0];

        // Create admin user
        const user = await User.create({
            name,
            email,
            password,
            role: 'admin' // Explicitly set role to admin
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        } else {
            res.status(400).json({ message: 'Invalid admin data' });
        }
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        res.status(500).json({ message: error.message });
    }
};
// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {

    try {
        const user = await User.findById(req.params.id);

        if (user) {

            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();


            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            });
        } else {

            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(`Update error for user ${req.params.id}:`, error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'A user with this email already exists' });
        }
        res.status(500).json({ message: error.message });
    }
};
