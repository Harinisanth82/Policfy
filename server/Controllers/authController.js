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
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ name, email, password });
    if (user) {
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
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
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
export const getMe = async (req, res) => {
    res.status(200).json({
        ...req.user._doc,
        redirectUrl: getRedirectUrl(req.user.role)
    });
};

// @desc    Google Login
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
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            user = await User.create({
                name,
                email,
                password: randomPassword,
                role: 'user',
            });
        }
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
export const googleAuthCallback = async (req, res) => {
    const { code } = req.query;
    try {
        const backendUrl = process.env.SERVER_URL || 'http://localhost:5001';
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
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            user = await User.create({ name, email, password: randomPassword, role: 'user' });
        }
        const token = generateToken(user._id);
        user.currentSessionToken = token;
        await user.save();

        // Use dynamic client URL based on environment
        const frontendUrl = process.env.CLIENT_URL || 'http://localhost:3000';

        // Redirect to client with token
        res.redirect(`${frontendUrl}/login?token=${token}`);
    } catch (error) {
        console.error("Google Auth Callback Error:", error);
        const frontendUrl = process.env.CLIENT_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/login?error=GoogleAuthFailed`);
    }
};
