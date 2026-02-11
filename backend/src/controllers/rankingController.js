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

// 获取本周积分排行榜
exports.getWeeklyLeaderboard = async (req, res) => {
    try {
        const [ranking] = await db.execute(
            `SELECT u.username, u.staff_id, IFNULL(SUM(pl.amount), 0) as weekly_points
             FROM users u
             LEFT JOIN point_logs pl ON u.id = pl.user_id 
               AND pl.created_at >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
             WHERE u.role = 'employee'
             GROUP BY u.id
             HAVING weekly_points > 0
             ORDER BY weekly_points DESC
             LIMIT 50`
        );
        res.json(ranking);
    } catch (error) {
        console.error('Get weekly leaderboard error:', error);
        res.status(500).json({ message: '获取周榜失败' });
    }
};
