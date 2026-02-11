const db = require('../config/db');

// 员工提交任务截图
exports.submitTask = async (req, res) => {
    const { task_id, image_url } = req.body;
    const user_id = req.user.id;

    try {
        // 检查任务是否存在
        const [tasks] = await db.execute('SELECT * FROM tasks WHERE id = ?', [task_id]);
        if (tasks.length === 0) {
            return res.status(404).json({ message: '任务不存在' });
        }

        // 提交记录
        const [result] = await db.execute(
            'INSERT INTO submissions (user_id, task_id, image_url) VALUES (?, ?, ?)',
            [user_id, task_id, image_url]
        );

        res.status(201).json({ message: '提交成功，请等待审核', submissionId: result.insertId });
    } catch (error) {
        console.error('Submit task error:', error);
        res.status(500).json({ message: '提交失败' });
    }
};

// 管理员审核提交
exports.reviewSubmission = async (req, res) => {
    const { submission_id, status, reject_reason } = req.body;
    const reviewer_id = req.user.id;

    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: '无效的状态' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. 获取提交详情
        const [submissions] = await connection.execute(
            'SELECT s.*, t.reward_points FROM submissions s JOIN tasks t ON s.task_id = t.id WHERE s.id = ?',
            [submission_id]
        );

        if (submissions.length === 0) {
            throw new Error('提交记录不存在');
        }

        const submission = submissions[0];
        if (submission.status !== 'pending') {
            throw new Error('该记录已审核');
        }

        // 2. 更新提交状态
        await connection.execute(
            'UPDATE submissions SET status = ?, reject_reason = ?, reviewed_at = NOW(), reviewed_by = ? WHERE id = ?',
            [status, status === 'rejected' ? reject_reason : null, reviewer_id, submission_id]
        );

        // 3. 如果通过，增加积分并记录流水
        if (status === 'approved') {
            const reward = submission.reward_points;

            // 更新用户总积分
            await connection.execute(
                'UPDATE users SET total_points = total_points + ? WHERE id = ?',
                [reward, submission.user_id]
            );

            // 记录积分流水
            await connection.execute(
                'INSERT INTO point_logs (user_id, amount, reference_id) VALUES (?, ?, ?)',
                [submission.user_id, reward, submission_id]
            );
        }

        await connection.commit();
        res.json({ message: `审核完成: ${status}` });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Review submission error:', error);
        res.status(500).json({ message: error.message || '审核处理失败' });
    } finally {
        if (connection) connection.release();
    }
};

// 获取待审核列表 (仅管理员)
exports.getPendingSubmissions = async (req, res) => {
    try {
        const [list] = await db.execute(
            `SELECT s.*, u.username, u.staff_id, t.title as task_title 
       FROM submissions s 
       JOIN users u ON s.user_id = u.id 
       JOIN tasks t ON s.task_id = t.id 
       WHERE s.status = 'pending' 
       ORDER BY s.submitted_at ASC`
        );
        res.json(list);
    } catch (error) {
        res.status(500).json({ message: '获取审核列表失败' });
    }
};
