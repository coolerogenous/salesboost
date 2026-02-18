const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// 加载环境变量
const envPath = path.resolve(__dirname, `.env.${process.env.NODE_ENV || 'development'}`);
if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
} else {
    require('dotenv').config(); // 默认加载 .env
}

const { sequelize, User } = require('./models');
const bcrypt = require('bcryptjs');

const app = express();

// 中间件
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件 - 上传图片
const uploadsDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// API 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/boss', require('./routes/boss'));
app.use('/api/staff', require('./routes/staff'));

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// 全局错误处理
app.use((err, req, res, next) => {
    console.error('全局错误:', err);
    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: '文件大小不能超过5MB' });
        }
        return res.status(400).json({ message: '文件上传错误' });
    }
    res.status(500).json({ message: err.message || '服务器内部错误' });
});

// 初始化种子数据
async function seedData() {
    const adminExists = await User.findOne({ where: { employee_id: 'admin' } });
    if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);
        await User.create({
            employee_id: 'admin',
            name: '管理员',
            password: hashedPassword,
            role: 'boss',
            points: 0
        });
        console.log('✅ 初始管理员账号已创建: admin / 123456');
    }
}

// 启动
const PORT = process.env.PORT || 5000;

sequelize.sync().then(async () => {
    console.log(`✅ 数据库 [${process.env.DB_NAME}] 连接成功，表已确认/同步`);
    await seedData();

    app.listen(PORT, () => {
        console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
        console.log(`📦 环境: ${process.env.NODE_ENV || 'development'}`);
    });
}).catch(err => {
    console.error('❌ 数据库连接失败:', err.message);
    process.exit(1);
});
