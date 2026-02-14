import express from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

import multer from 'multer';
import path from 'path';

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

router.get('/', protect, getTasks);
router.post('/', protect, admin, upload.single('image'), createTask);
router.put('/:id', protect, admin, upload.single('image'), updateTask);
router.delete('/:id', protect, admin, deleteTask);

export default router;
