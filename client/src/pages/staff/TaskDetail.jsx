import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import { showToast } from '../../components/Toast';

export default function TaskDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileRef = useRef(null);
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTask();
    }, [id]);

    const fetchTask = async () => {
        try {
            const res = await api.get(`/staff/tasks/${id}`);
            setTask(res.data);
        } catch (err) {
            showToast('任务不存在', 'error');
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('content', content);
            if (image) formData.append('image', image);

            await api.post(`/staff/tasks/${id}/submit`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            showToast('提交成功，等待审核', 'success');
            fetchTask();
        } catch (err) {
            showToast(err.response?.data?.message || '提交失败', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="page"><div className="loading"><div className="spinner"></div></div></div>;
    if (!task) return null;

    const canSubmit = !task.my_submission || task.my_submission.status === 'rejected';
    const sub = task.my_submission;

    return (
        <div className="page">
            <button className="detail-back" onClick={() => navigate(-1)}>← 返回</button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, marginTop: 8 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700 }}>{task.title}</h1>
                <span className="badge badge-points" style={{ fontSize: 16 }}>🏆 {task.reward_points}分</span>
            </div>

            {task.image_url && (
                <img src={task.image_url} alt="任务示例" className="detail-image" />
            )}

            {task.description && (
                <div className="card" style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>任务说明</div>
                    <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-primary)' }}>{task.description}</div>
                </div>
            )}

            {task.deadline && (
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                    ⏰ 截止时间：{new Date(task.deadline).toLocaleString('zh-CN')}
                </div>
            )}

            {/* 已有提交 */}
            {sub && (
                <div className="card" style={{ borderLeft: `3px solid ${sub.status === 'approved' ? 'var(--success)' : sub.status === 'rejected' ? 'var(--danger)' : 'var(--warning)'}` }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>
                        我的提交
                        <span className={`badge badge-${sub.status}`} style={{ marginLeft: 8 }}>
                            {sub.status === 'pending' ? '审核中' : sub.status === 'approved' ? '已通过' : '已驳回'}
                        </span>
                    </div>
                    {sub.content && <div style={{ fontSize: 13, marginBottom: 8 }}>{sub.content}</div>}
                    {sub.image_url && (
                        <img src={sub.image_url} alt="提交图" style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
                    )}
                    {sub.reject_reason && (
                        <div style={{ fontSize: 13, color: 'var(--danger)', background: 'var(--danger-bg)', padding: '8px 12px', borderRadius: 8 }}>
                            驳回理由：{sub.reject_reason}
                        </div>
                    )}
                    {sub.status === 'approved' && (
                        <div style={{ fontSize: 14, color: 'var(--success)', fontWeight: 600, marginTop: 4 }}>
                            ✅ 已获得 {task.reward_points} 积分
                        </div>
                    )}
                </div>
            )}

            {/* 提交表单 */}
            {canSubmit && (
                <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
                        {sub?.status === 'rejected' ? '重新提交' : '提交任务'}
                    </div>
                    <div className="form-group">
                        <textarea
                            className="form-input"
                            placeholder="补充说明（选填）"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <div className="form-group">
                        <input type="file" accept="image/*" className="file-input-hidden" ref={fileRef} onChange={handleImage} />
                        {preview ? (
                            <div onClick={() => fileRef.current?.click()} style={{ cursor: 'pointer' }}>
                                <img src={preview} alt="预览" className="upload-preview" />
                                <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>点击更换</p>
                            </div>
                        ) : (
                            <div className="upload-area" onClick={() => fileRef.current?.click()}>
                                <div className="upload-icon">📸</div>
                                <div className="upload-text">上传完成照片</div>
                            </div>
                        )}
                    </div>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                        {submitting ? '提交中...' : '提交'}
                    </button>
                </div>
            )}
        </div>
    );
}
