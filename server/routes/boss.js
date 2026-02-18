const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bossController = require('../controllers/bossController');
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
        cb(null, 'task-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
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

// 所有老板端路由需要登录 + boss 角色
router.use(auth, role('boss'));

// 任务管理
router.post('/tasks', upload.single('image'), bossController.createTask);
router.get('/tasks', bossController.getTasks);

// 审核管理
router.get('/submissions', bossController.getSubmissions);
router.put('/submissions/:id/approve', bossController.approveSubmission);
router.put('/submissions/:id/reject', bossController.rejectSubmission);

// 人员管理
router.get('/staff', bossController.getStaff);
router.post('/staff', bossController.addStaff);
router.delete('/staff/:id', bossController.deleteStaff);

module.exports = router;
