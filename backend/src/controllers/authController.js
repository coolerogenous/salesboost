const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.login = async (req, res) => {
    const { staff_id, password } = req.body;

    try {
        // 1. 查找用户
        const [users] = await db.execute('SELECT * FROM users WHERE staff_id = ?', [staff_id]);
        if (users.length === 0) {
            return res.status(401).json({ message: '工号或密码错误' });
        }

        const user = users[0];

        // 2. 校验密码 (这里支持明文比对用于初始 admin，生产环境应全部使用 bcrypt)
        let isMatch = false;
        if (user.password === password) { // 兼容 init.sql 中的初始明文密码
            isMatch = true;
        } else {
            isMatch = await bcrypt.compare(password, user.password);
        }

        if (!isMatch) {
            return res.status(401).json({ message: '工号或密码错误' });
        }

        // 3. 生成 JWT
        const token = jwt.sign(
            { id: user.id, staff_id: user.staff_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: '登录成功',
            token,
            user: {
                id: user.id,
                staff_id: user.staff_id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: '服务器内部错误' });
    }
};
