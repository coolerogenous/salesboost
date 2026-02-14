import express from 'express';
import multer from 'multer';
import path from 'path';
import { getSubmissions, createSubmission, auditSubmission } from '../controllers/submissionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });

router.get('/', protect, getSubmissions);
router.post('/', protect, upload.single('image'), createSubmission);
router.put('/:id/audit', protect, admin, auditSubmission);

export default router;
