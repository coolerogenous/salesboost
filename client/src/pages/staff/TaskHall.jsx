import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

export default function TaskHall() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/staff/tasks');
            setTasks(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const statusText = {
        pending: '审核中',
        approved: '已完成',
        rejected: '已驳回'
    };

    const statusClass = {
        pending: 'pending',
        approved: 'approved',
        rejected: 'rejected'
    };

    const formatDate = (d) => {
        if (!d) return '无限期';
        return new Date(d).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    if (loading) return <div className="page"><div className="loading"><div className="spinner"></div></div></div>;

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">任务大厅</h1>
            </div>

            {tasks.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🏠</div>
                    <div className="empty-text">暂无可领取的任务</div>
                </div>
            ) : (
                tasks.map(task => (
                    <div
                        className="card card-clickable task-card"
                        key={task.id}
                        onClick={() => navigate(`/staff/tasks/${task.id}`)}
                    >
                        <div className="task-card-header">
                            <div className="task-card-title">{task.title}</div>
                            <span className="badge badge-points">🏆 {task.reward_points}分</span>
                        </div>
                        {task.description && (
                            <div className="task-card-desc">{task.description}</div>
                        )}
                        <div className="task-card-footer">
                            <span>📅 截止 {formatDate(task.deadline)}</span>
                            {task.my_status ? (
                                <span className={`badge badge-${statusClass[task.my_status]}`}>
                                    {statusText[task.my_status]}
                                </span>
                            ) : (
                                <span className="badge badge-active">待领取</span>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
