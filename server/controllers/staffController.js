const { User, Task, Submission } = require('../models');
const sequelize = require('../config/database');

// 任务大厅 - 获取所有活跃任务
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            where: { status: 'active' },
            order: [['created_at', 'DESC']],
            attributes: ['id', 'title', 'description', 'image_url', 'reward_points', 'deadline', 'created_at']
        });

        // 获取当前用户对每个任务的提交状态
        const taskIds = tasks.map(t => t.id);
        const mySubmissions = await Submission.findAll({
            where: {
                task_id: taskIds,
                user_id: req.user.id
            },
            attributes: ['task_id', 'status']
        });

        const submissionMap = {};
        mySubmissions.forEach(s => {
            submissionMap[s.task_id] = s.status;
        });

        const result = tasks.map(t => ({
            ...t.toJSON(),
            my_status: submissionMap[t.id] || null
        }));

        res.json(result);
    } catch (err) {
        console.error('获取任务列表错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 任务详情
exports.getTaskDetail = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ message: '任务不存在' });
        }

        // 查当前用户是否已提交
        const mySubmission = await Submission.findOne({
            where: { task_id: task.id, user_id: req.user.id }
        });

        res.json({
            ...task.toJSON(),
            my_submission: mySubmission
        });
    } catch (err) {
        console.error('获取任务详情错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 提交任务
exports.submitTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findByPk(taskId);

        if (!task) {
            return res.status(404).json({ message: '任务不存在' });
        }

        if (task.status !== 'active') {
            return res.status(400).json({ message: '任务已关闭' });
        }

        // 检查是否已提交（未驳回状态不能重复提交）
        const existing = await Submission.findOne({
            where: {
                task_id: taskId,
                user_id: req.user.id,
                status: ['pending', 'approved']
            }
        });

        if (existing) {
            return res.status(400).json({ message: '你已提交过该任务' });
        }

        const submissionData = {
            task_id: taskId,
            user_id: req.user.id,
            content: req.body.content || ''
        };

        if (req.file) {
            const { uploadToOSS } = require('../utils/oss');
            submissionData.image_url = await uploadToOSS(req.file.buffer, req.file.originalname, 'sub');
        }

        const submission = await Submission.create(submissionData);
        res.status(201).json({ message: '提交成功，等待审核', submission });
    } catch (err) {
        console.error('提交任务错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 我的任务状态列表
exports.getMySubmissions = async (req, res) => {
    try {
        const submissions = await Submission.findAll({
            where: { user_id: req.user.id },
            order: [['created_at', 'DESC']],
            include: [{
                model: Task,
                as: 'task',
                attributes: ['id', 'title', 'reward_points']
            }]
        });
        res.json(submissions);
    } catch (err) {
        console.error('获取我的提交错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 积分排行榜
exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.findAll({
            where: { role: 'staff' },
            attributes: ['id', 'employee_id', 'name', 'points', 'avatar'],
            order: [['points', 'DESC']],
            limit: 50
        });

        // 计算当前用户的排名
        const myRank = leaderboard.findIndex(u => u.id === req.user.id) + 1;
        const me = await User.findByPk(req.user.id, {
            attributes: ['id', 'employee_id', 'name', 'points', 'avatar']
        });

        res.json({
            leaderboard,
            me: {
                ...me.toJSON(),
                rank: myRank > 0 ? myRank : null
            }
        });
    } catch (err) {
        console.error('获取排行榜错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 我的信息
exports.getMyInfo = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'employee_id', 'name', 'points', 'avatar', 'role']
        });

        // 计算排名
        const higherCount = await User.count({
            where: {
                role: 'staff',
                points: { [require('sequelize').Op.gt]: user.points }
            }
        });

        res.json({
            ...user.toJSON(),
            rank: higherCount + 1
        });
    } catch (err) {
        console.error('获取我的信息错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};
