import express from 'express';
import { registerUser, loginUser, getMe, googleLogin, googleAuthCallback } from '../Controllers/authController.js';
import { protect } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.get('/google/callback', googleAuthCallback);
router.get('/me', protect, getMe);

export default router;
