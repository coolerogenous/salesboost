const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/auth');

router.get('/profile', authMiddleware, userController.getProfile);
router.get('/point-logs', authMiddleware, userController.getPointLogs);
router.get('/stats', authMiddleware, userController.getMyStats);

module.exports = router;
