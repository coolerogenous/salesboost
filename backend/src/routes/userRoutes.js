const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/auth');

router.get('/profile', authMiddleware, userController.getProfile);
router.get('/point-logs', authMiddleware, userController.getPointLogs);
router.get('/stats', authMiddleware, userController.getMyStats);

// 管理员专用：人员管理
const { adminMiddleware } = require('../middlewares/auth');
router.get('/staff', authMiddleware, adminMiddleware, userController.getAllStaff);
router.post('/staff', authMiddleware, adminMiddleware, userController.addStaff);
router.delete('/staff/:id', authMiddleware, adminMiddleware, userController.deleteStaff);
router.get('/export-stats', authMiddleware, adminMiddleware, userController.exportStats);

module.exports = router;
