import { useState, useEffect } from 'react';
import api from '../../api';

export default function MyTasks() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const res = await api.get('/staff/submissions');
            setSubmissions(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const statusConfig = {
        pending: { text: '审核中', class: 'pending', icon: '⏳' },
        approved: { text: '已完成', class: 'approved', icon: '✅' },
        rejected: { text: '已驳回', class: 'rejected', icon: '❌' }
    };

    if (loading) return <div className="page"><div className="loading"><div className="spinner"></div></div></div>;

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">我的任务</h1>
            </div>

            {submissions.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <div className="empty-text">还没有提交过任务哦</div>
                </div>
            ) : (
                submissions.map(sub => {
                    const st = statusConfig[sub.status];
                    return (
                        <div className="card" key={sub.id} style={{ borderLeft: `3px solid var(--${st.class === 'pending' ? 'warning' : st.class === 'approved' ? 'success' : 'danger'})` }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                                <div style={{ fontWeight: 600, fontSize: 15, flex: 1 }}>{sub.task?.title}</div>
                                <span className={`badge badge-${st.class}`}>{st.icon} {st.text}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                    {new Date(sub.created_at).toLocaleDateString('zh-CN')}
                                </span>
                                {sub.status === 'approved' && (
                                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--gold)' }}>🏆 +{sub.task?.reward_points}分</span>
                                )}
                            </div>

                            {sub.reject_reason && (
                                <div style={{ fontSize: 12, color: 'var(--danger)', background: 'var(--danger-bg)', padding: '6px 10px', borderRadius: 6, marginTop: 8 }}>
                                    {sub.reject_reason}
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}
