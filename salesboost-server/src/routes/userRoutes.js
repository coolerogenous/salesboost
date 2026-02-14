import express from 'express';
import { getLeaderboard, getProfile, getUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/leaderboard', protect, getLeaderboard);
router.get('/profile', protect, getProfile);
router.get('/', protect, admin, getUsers);
router.post('/', protect, admin, createUser);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

export default router;
