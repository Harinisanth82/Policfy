import express from 'express';
import { getUserProfile, getAllUsers, deleteUser, createAdmin, updateUser } from '../Controllers/userController.js';
import { protect, admin } from '../Middleware/authMiddleware.js';

const router = express.Router();


router.get('/profile', protect, getUserProfile);
router.get('/', protect, admin, getAllUsers);
router.post('/admin', protect, admin, createAdmin);
router.put('/edit/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

export default router;
