const db = require('../config/db');

// 获取任务列表 (员工看 active, 管理员看全部)
exports.getTasks = async (req, res) => {
    try {
        let query = 'SELECT * FROM tasks';
        let params = [];

        if (req.user.role !== 'admin') {
            query += ' WHERE status = "active" AND (end_time > NOW() OR end_time IS NULL)';
        }

        const [tasks] = await db.execute(query, params);
        res.json(tasks);
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ message: '获取任务失败' });
    }
};

// 创建任务 (仅管理员)
exports.createTask = async (req, res) => {
    const { title, description, reward_points, end_time, images } = req.body; // images is array

    try {
        const imagesJson = images ? JSON.stringify(images) : null;
        const [result] = await db.execute(
            'INSERT INTO tasks (title, description, reward_points, end_time, images, created_by) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, reward_points, end_time, imagesJson, req.user.id]
        );
        res.status(201).json({ message: '任务创建成功', taskId: result.insertId });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ message: '创建任务失败' });
    }
};

// 获取任务详情
exports.getTaskById = async (req, res) => {
    const { id } = req.params;
    try {
        const [tasks] = await db.execute('SELECT * FROM tasks WHERE id = ?', [id]);
        if (tasks.length === 0) {
            return res.status(404).json({ message: '任务不存在' });
        }
        res.json(tasks[0]);
    } catch (error) {
        res.status(500).json({ message: '获取详情失败' });
    }
};
// 更新任务 (仅管理员)
exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, reward_points, end_time, status, images } = req.body;

    try {
        const imagesJson = images ? JSON.stringify(images) : null;
        await db.execute(
            'UPDATE tasks SET title = ?, description = ?, reward_points = ?, end_time = ?, status = ?, images = ? WHERE id = ?',
            [title, description, reward_points, end_time, status, imagesJson, id]
        );
        res.json({ message: '任务更新成功' });
    } catch (error) {
        if (req.body.images) console.error(error); // Debug hint
        res.status(500).json({ message: '更新任务失败' });
    }
};

// 删除任务 (仅管理员)
exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. 删除该任务的所有提交记录
        await connection.execute('DELETE FROM submissions WHERE task_id = ?', [id]);

        // 2. 删除任务本身
        await connection.execute('DELETE FROM tasks WHERE id = ?', [id]);

        await connection.commit();
        res.json({ message: '任务及其关联记录删除成功' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Delete task error:', error);
        res.status(500).json({ message: '删除任务失败' });
    } finally {
        if (connection) connection.release();
    }
};
