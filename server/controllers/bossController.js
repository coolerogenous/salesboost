const bcrypt = require('bcryptjs');
const { User, Task, Submission } = require('../models');
const { Op } = require('sequelize');

// ======== 任务管理 ========

// 发布任务
exports.createTask = async (req, res) => {
    try {
        const { title, description, reward_points, deadline } = req.body;

        if (!title || !reward_points) {
            return res.status(400).json({ message: '请填写任务标题和奖励积分' });
        }

        const taskData = {
            title,
            description,
            reward_points: parseInt(reward_points),
            deadline: deadline || null,
            created_by: req.user.id
        };

        // 处理上传的图片
        if (req.file) {
            taskData.image_url = '/uploads/' + req.file.filename;
        }

        const task = await Task.create(taskData);
        res.status(201).json({ message: '任务发布成功', task });
    } catch (err) {
        console.error('发布任务错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 获取所有任务
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            order: [['created_at', 'DESC']],
            include: [{
                model: Submission,
                as: 'submissions',
                attributes: ['id', 'status']
            }]
        });
        res.json(tasks);
    } catch (err) {
        console.error('获取任务错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// ======== 审核管理 ========

// 待审核列表
exports.getSubmissions = async (req, res) => {
    try {
        const { status } = req.query;
        const where = {};
        if (status) where.status = status;

        const submissions = await Submission.findAll({
            where,
            order: [['created_at', 'DESC']],
            include: [
                { model: Task, as: 'task', attributes: ['id', 'title', 'reward_points'] },
                { model: User, as: 'user', attributes: ['id', 'employee_id', 'name'] }
            ]
        });
        res.json(submissions);
    } catch (err) {
        console.error('获取提交列表错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 审核通过
exports.approveSubmission = async (req, res) => {
    try {
        const submission = await Submission.findByPk(req.params.id, {
            include: [{ model: Task, as: 'task' }]
        });

        if (!submission) {
            return res.status(404).json({ message: '提交记录不存在' });
        }

        if (submission.status !== 'pending') {
            return res.status(400).json({ message: '该提交已被处理' });
        }

        // 更新提交状态
        submission.status = 'approved';
        submission.reviewed_at = new Date();
        await submission.save();

        // 给员工加积分
        const user = await User.findByPk(submission.user_id);
        user.points += submission.task.reward_points;
        await user.save();

        res.json({
            message: '审核通过，积分已发放',
            points_added: submission.task.reward_points,
            user_total_points: user.points
        });
    } catch (err) {
        console.error('审核通过错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 驳回
exports.rejectSubmission = async (req, res) => {
    try {
        const { reject_reason } = req.body;

        if (!reject_reason) {
            return res.status(400).json({ message: '请填写驳回理由' });
        }

        const submission = await Submission.findByPk(req.params.id);

        if (!submission) {
            return res.status(404).json({ message: '提交记录不存在' });
        }

        if (submission.status !== 'pending') {
            return res.status(400).json({ message: '该提交已被处理' });
        }

        submission.status = 'rejected';
        submission.reject_reason = reject_reason;
        submission.reviewed_at = new Date();
        await submission.save();

        res.json({ message: '已驳回' });
    } catch (err) {
        console.error('驳回错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// ======== 人员管理 ========

// 获取员工列表
exports.getStaff = async (req, res) => {
    try {
        const staff = await User.findAll({
            where: { role: 'staff' },
            attributes: ['id', 'employee_id', 'name', 'points', 'created_at'],
            order: [['created_at', 'DESC']]
        });
        res.json(staff);
    } catch (err) {
        console.error('获取员工列表错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 添加员工
exports.addStaff = async (req, res) => {
    try {
        const { employee_id, name, password } = req.body;

        if (!employee_id || !name || !password) {
            return res.status(400).json({ message: '请填写工号、姓名和密码' });
        }

        const existing = await User.findOne({ where: { employee_id } });
        if (existing) {
            return res.status(400).json({ message: '该工号已存在' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            employee_id,
            name,
            password: hashedPassword,
            role: 'staff'
        });

        res.status(201).json({
            message: '员工添加成功',
            user: {
                id: user.id,
                employee_id: user.employee_id,
                name: user.name,
                role: user.role,
                points: user.points
            }
        });
    } catch (err) {
        console.error('添加员工错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 删除员工
exports.deleteStaff = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: '员工不存在' });
        }

        if (user.role === 'boss') {
            return res.status(400).json({ message: '不能删除管理员账号' });
        }

        await user.destroy();
        res.json({ message: '员工已删除' });
    } catch (err) {
        console.error('删除员工错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};
