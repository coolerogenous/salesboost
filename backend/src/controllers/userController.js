const db = require('../config/db');

// 获取当前用户信息（包含最新积分）
exports.getProfile = async (req, res) => {
    try {
        const [users] = await db.execute(
            'SELECT id, staff_id, username, role, total_points, created_at FROM users WHERE id = ?',
            [req.user.id]
        );
        if (users.length === 0) {
            return res.status(404).json({ message: '用户不存在' });
        }
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ message: '获取个人信息失败' });
    }
};

// 获取积分流水
exports.getPointLogs = async (req, res) => {
    try {
        const [logs] = await db.execute(
            `SELECT pl.*, t.title as task_title 
       FROM point_logs pl 
       LEFT JOIN submissions s ON pl.reference_id = s.id 
       LEFT JOIN tasks t ON s.task_id = t.id 
       WHERE pl.user_id = ? 
       ORDER BY pl.created_at DESC`,
            [req.user.id]
        );
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: '获取积分记录失败' });
    }
};

// 获取我的任务完成统计
exports.getMyStats = async (req, res) => {
    try {
        const [stats] = await db.execute(
            `SELECT 
        COUNT(*) as total_submissions,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_count,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_count
       FROM submissions 
       WHERE user_id = ?`,
            [req.user.id]
        );
        res.json(stats[0]);
    } catch (error) {
        res.status(500).json({ message: '获取统计信息失败' });
    }
};
