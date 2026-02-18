const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// 登录
exports.login = async (req, res) => {
    try {
        const { employee_id, password } = req.body;

        if (!employee_id || !password) {
            return res.status(400).json({ message: '请输入工号和密码' });
        }

        const user = await User.findOne({ where: { employee_id } });
        if (!user) {
            return res.status(401).json({ message: '工号或密码错误' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: '工号或密码错误' });
        }

        const token = jwt.sign(
            { id: user.id, employee_id: user.employee_id, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: '登录成功',
            token,
            user: {
                id: user.id,
                employee_id: user.employee_id,
                name: user.name,
                role: user.role,
                points: user.points
            }
        });
    } catch (err) {
        console.error('登录错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 修改密码
exports.changePassword = async (req, res) => {
    try {
        const { old_password, new_password } = req.body;

        if (!old_password || !new_password) {
            return res.status(400).json({ message: '请输入旧密码和新密码' });
        }

        if (new_password.length < 4) {
            return res.status(400).json({ message: '新密码长度不能少于4位' });
        }

        const user = await User.findByPk(req.user.id);
        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: '旧密码错误' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(new_password, salt);
        await user.save();

        res.json({ message: '密码修改成功' });
    } catch (err) {
        console.error('修改密码错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 获取当前用户信息
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'employee_id', 'name', 'role', 'points', 'avatar']
        });
        res.json(user);
    } catch (err) {
        console.error('获取用户信息错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};
