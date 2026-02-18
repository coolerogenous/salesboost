const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const staffController = require('../controllers/staffController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

// 文件上传配置
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'sub-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp/;
        const extname = allowed.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowed.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('只支持图片文件'));
        }
    }
});

// 所有员工端路由需要登录 + staff 角色
router.use(auth, role('staff'));

// 任务大厅
router.get('/tasks', staffController.getTasks);
router.get('/tasks/:id', staffController.getTaskDetail);
router.post('/tasks/:id/submit', upload.single('image'), staffController.submitTask);

// 我的任务
router.get('/submissions', staffController.getMySubmissions);

// 排行榜
router.get('/leaderboard', staffController.getLeaderboard);

// 我的信息
router.get('/me', staffController.getMyInfo);

module.exports = router;
