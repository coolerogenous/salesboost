import { useState, useEffect } from 'react';
import api from '../../api';
import { showToast } from '../../components/Toast';

export default function ReviewList() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [rejectModal, setRejectModal] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchSubmissions();
    }, [filter]);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const res = await api.get('/boss/submissions', { params: { status: filter } });
            setSubmissions(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        setActionLoading(true);
        try {
            const res = await api.put(`/boss/submissions/${id}/approve`);
            showToast(`✅ 已通过，发放 ${res.data.points_added} 积分`, 'success');
            fetchSubmissions();
        } catch (err) {
            showToast(err.response?.data?.message || '操作失败', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            showToast('请填写驳回理由', 'error');
            return;
        }
        setActionLoading(true);
        try {
            await api.put(`/boss/submissions/${rejectModal}/reject`, { reject_reason: rejectReason });
            showToast('已驳回', 'success');
            setRejectModal(null);
            setRejectReason('');
            fetchSubmissions();
        } catch (err) {
            showToast(err.response?.data?.message || '操作失败', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const statusMap = {
        pending: '待审核',
        approved: '已通过',
        rejected: '已驳回'
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">审核中心</h1>
            </div>

            {/* 筛选 */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
                {['pending', 'approved', 'rejected'].map(s => (
                    <button
                        key={s}
                        className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setFilter(s)}
                    >
                        {statusMap[s]}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="loading"><div className="spinner"></div></div>
            ) : submissions.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <div className="empty-text">暂无{statusMap[filter]}的提交</div>
                </div>
            ) : (
                submissions.map(sub => (
                    <div className="card review-card" key={sub.id}>
                        <div className="review-card-user">
                            <div className="review-card-user-avatar">{sub.user?.name?.[0]}</div>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 14 }}>{sub.user?.name}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub.user?.employee_id}</div>
                            </div>
                            <span className={`badge badge-${sub.status}`} style={{ marginLeft: 'auto' }}>
                                {statusMap[sub.status]}
                            </span>
                        </div>

                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                            📋 {sub.task?.title}
                            <span className="badge badge-points" style={{ marginLeft: 8 }}>🏆 {sub.task?.reward_points}分</span>
                        </div>

                        {sub.content && <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>{sub.content}</div>}

                        {sub.image_url && (
                            <img
                                src={sub.image_url}
                                alt="提交图片"
                                style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }}
                            />
                        )}

                        {sub.reject_reason && (
                            <div style={{ fontSize: 13, color: 'var(--danger)', background: 'var(--danger-bg)', padding: '8px 12px', borderRadius: 8, marginBottom: 8 }}>
                                驳回理由：{sub.reject_reason}
                            </div>
                        )}

                        {sub.status === 'pending' && (
                            <div className="btn-group" style={{ marginTop: 8 }}>
                                <button className="btn btn-success btn-sm" onClick={() => handleApprove(sub.id)} disabled={actionLoading}>
                                    ✅ 通过
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => setRejectModal(sub.id)} disabled={actionLoading}>
                                    ❌ 驳回
                                </button>
                            </div>
                        )}
                    </div>
                ))
            )}

            {/* 驳回弹窗 */}
            {rejectModal && (
                <div className="modal-overlay" onClick={() => setRejectModal(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-title">驳回理由</div>
                        <div className="form-group">
                            <textarea
                                className="form-input"
                                placeholder="请输入驳回理由..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                rows={3}
                            />
                        </div>
                        <div className="btn-group">
                            <button className="btn btn-outline btn-sm" onClick={() => setRejectModal(null)}>取消</button>
                            <button className="btn btn-danger btn-sm" onClick={handleReject} disabled={actionLoading}>
                                {actionLoading ? '提交中...' : '确认驳回'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
