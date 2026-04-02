import express from 'express';
import { handleChat } from '../Controllers/chatController.js';

const router = express.Router();

// POST /api/chat
router.post('/', handleChat);

export default router;
