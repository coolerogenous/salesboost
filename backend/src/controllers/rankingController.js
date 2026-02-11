const db = require('../config/db');

// 获取总积分排行榜
exports.getLeaderboard = async (req, res) => {
    try {
        const [ranking] = await db.execute(
            `SELECT username, staff_id, total_points 
       FROM users 
       WHERE role = 'employee' 
       ORDER BY total_points DESC 
       LIMIT 50`
        );
        res.json(ranking);
    } catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({ message: '获取排行榜失败' });
    }
};
