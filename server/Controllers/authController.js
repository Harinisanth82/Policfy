import User from '../Models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Helper function to get redirect URL based on role
const getRedirectUrl = (role) => {
    switch (role) {
        case 'admin':
            return '/admin';
        case 'user':
            return '/';
        default:
            return '/';
    }
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password
    });

    if (user) {
        // Save session token
        user.currentSessionToken = generateToken(user._id);
        await user.save();

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            redirectUrl: getRedirectUrl(user.role),
            token: user.currentSessionToken
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        // Save session token
        const token = generateToken(user._id);
        user.currentSessionToken = token;
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            redirectUrl: getRedirectUrl(user.role),
            token: token
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    res.status(200).json({
        ...req.user._doc,
        redirectUrl: getRedirectUrl(req.user.role)
    });
};

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res) => {
    const { code } = req.body;

    try {
        const client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'postmessage'
        );
        const { tokens } = await client.getToken(code);
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email, picture } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            // Create a new user if not exists
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

            user = await User.create({
                name,
                email,
                password: randomPassword,
                role: 'user', // Default role
                // img: picture // Assuming User model has img field? Verify schema.
            });
        }

        // Save session token
        const token = generateToken(user._id);
        user.currentSessionToken = token;
        await user.save();

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            redirectUrl: getRedirectUrl(user.role),
            token: token
        });

    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(500).json({ message: 'Google Login failed' });
    }
};

// @desc    Google Auth Callback
// @route   GET /api/auth/google/callback
// @access  Public
export const googleAuthCallback = async (req, res) => {
    const { code } = req.query;

    try {
        // Use dynamic redirect URL based on environment or fallback to production Render URL
        const backendUrl = process.env.NODE_ENV === 'production'
            ? 'https://policfy-api.onrender.com'
            : (process.env.SERVER_URL || 'http://localhost:5001');

        const redirectUrl = `${backendUrl}/api/auth/google/callback`;

        const client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            redirectUrl
        );

        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);

        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email, picture } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            // Create a new user if not exists
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

            user = await User.create({
                name,
                email,
                password: randomPassword,
                role: 'user', // Default role
            });
        }

        // Save session token
        const token = generateToken(user._id);
        user.currentSessionToken = token;
        await user.save();

        // Use dynamic client URL based on environment or fallback to production Netlify URL
        const frontendUrl = process.env.NODE_ENV === 'production'
            ? 'https://policfy.netlify.app' // Updated exact Netlify URL
            : (process.env.CLIENT_URL || 'http://localhost:3000');

        // Redirect to client with token
        res.redirect(`${frontendUrl}/login?token=${token}`);

    } catch (error) {
        console.error("Google Auth Callback Error:", error);
        const frontendUrl = process.env.NODE_ENV === 'production'
            ? 'https://policfy.netlify.app' // Updated exact Netlify URL
            : (process.env.CLIENT_URL || 'http://localhost:3000');

        res.redirect(`${frontendUrl}/login?error=GoogleAuthFailed`);
    }
};
