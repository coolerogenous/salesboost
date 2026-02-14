import express from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getTasks);
router.post('/', protect, admin, createTask);
router.put('/:id', protect, admin, updateTask);
router.delete('/:id', protect, admin, deleteTask);

export default router;
