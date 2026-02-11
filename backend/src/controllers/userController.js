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
// 获取所有员工列表 (管理员专用)
exports.getAllStaff = async (req, res) => {
    try {
        const [list] = await db.execute(
            'SELECT id, staff_id, username, total_points, created_at FROM users WHERE role = "employee" ORDER BY created_at DESC'
        );
        res.json(list);
    } catch (error) {
        res.status(500).json({ message: '获取员工列表失败' });
    }
};

// 录入新员工
exports.addStaff = async (req, res) => {
    const { staff_id, username, password } = req.body;

    if (!staff_id || !username || !password) {
        return res.status(400).json({ message: '请填写完整信息' });
    }

    try {
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.execute(
            'INSERT INTO users (staff_id, username, password, role) VALUES (?, ?, ?, "employee")',
            [staff_id, username, hashedPassword]
        );
        res.status(201).json({ message: '员工录入成功' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: '工号已存在' });
        }
        res.status(500).json({ message: '录入失败' });
    }
};

// 删除员工
exports.deleteStaff = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM users WHERE id = ? AND role = "employee"', [id]);
        res.json({ message: '员工删除成功' });
    } catch (error) {
        res.status(500).json({ message: '删除失败' });
    }
};

// 导出统计报表 (Excel)
exports.exportStats = async (req, res) => {
    try {
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('员工积分排名');

        // 定义表头
        worksheet.columns = [
            { header: '工号', key: 'staff_id', width: 15 },
            { header: '姓名', key: 'username', width: 15 },
            { header: '总积分', key: 'total_points', width: 12 },
            { header: '入职时间', key: 'created_at', width: 25 }
        ];

        // 获取数据
        const [rows] = await db.execute(
            'SELECT staff_id, username, total_points, created_at FROM users WHERE role = "employee" ORDER BY total_points DESC'
        );

        // 添加数据
        worksheet.addRows(rows);

        // 设置响应头
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + encodeURIComponent('SalesBoost_Stats.xlsx')
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ message: '导出报表失败' });
    }
};
