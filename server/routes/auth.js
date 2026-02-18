const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');

// 登录
router.post('/login', authController.login);

// 修改密码（需登录）
router.put('/password', auth, authController.changePassword);

// 获取当前用户信息（需登录）
router.get('/profile', auth, authController.getProfile);

module.exports = router;
