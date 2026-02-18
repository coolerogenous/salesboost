import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

export default function BossTaskList() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/boss/tasks');
            setTasks(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (d) => {
        if (!d) return '';
        return new Date(d).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    };

    if (loading) return <div className="page"><div className="loading"><div className="spinner"></div></div></div>;

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">任务管理</h1>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/boss/tasks/create')}>
                    + 发布任务
                </button>
            </div>

            {tasks.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <div className="empty-text">暂无任务，点击右上角发布</div>
                </div>
            ) : (
                tasks.map((task) => (
                    <div className="card task-card" key={task.id}>
                        <div className="task-card-header">
                            <div className="task-card-title">{task.title}</div>
                            <span className="badge badge-points">🏆 {task.reward_points}分</span>
                        </div>
                        {task.description && <div className="task-card-desc">{task.description}</div>}
                        <div className="task-card-footer">
                            <span>📅 截止 {formatDate(task.deadline) || '无限期'}</span>
                            <span className={`badge badge-${task.status}`}>
                                {task.status === 'active' ? '进行中' : '已关闭'}
                            </span>
                        </div>
                        {task.submissions && task.submissions.length > 0 && (
                            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                                📥 {task.submissions.length} 份提交 ·
                                {task.submissions.filter(s => s.status === 'pending').length} 待审核
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
