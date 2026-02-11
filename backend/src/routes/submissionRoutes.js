const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

router.post('/submit', authMiddleware, submissionController.submitTask);
router.get('/pending', authMiddleware, adminMiddleware, submissionController.getPendingSubmissions);
router.post('/review', authMiddleware, adminMiddleware, submissionController.reviewSubmission);

module.exports = router;
