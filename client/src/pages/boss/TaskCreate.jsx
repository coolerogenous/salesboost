import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { showToast } from '../../components/Toast';

export default function TaskCreate() {
    const navigate = useNavigate();
    const fileRef = useRef(null);
    const [form, setForm] = useState({
        title: '',
        description: '',
        reward_points: '',
        deadline: ''
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) {
            showToast('请填写任务标题', 'error');
            return;
        }
        if (!form.reward_points || parseInt(form.reward_points) <= 0) {
            showToast('请设置奖励积分', 'error');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', form.title.trim());
            formData.append('description', form.description.trim());
            formData.append('reward_points', form.reward_points);
            if (form.deadline) formData.append('deadline', form.deadline);
            if (image) formData.append('image', image);

            await api.post('/boss/tasks', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            showToast('任务发布成功！', 'success');
            navigate('/boss/tasks');
        } catch (err) {
            showToast(err.response?.data?.message || '发布失败', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <button className="detail-back" onClick={() => navigate(-1)}>← 返回</button>
            <h1 className="page-title" style={{ marginBottom: 20 }}>发布新任务</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">任务标题 *</label>
                    <input
                        className="form-input"
                        placeholder="例如：货架陈列整理"
                        value={form.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">任务详情</label>
                    <textarea
                        className="form-input"
                        placeholder="详细描述任务要求..."
                        value={form.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">奖励积分 *</label>
                    <input
                        className="form-input"
                        type="number"
                        placeholder="例如：10"
                        value={form.reward_points}
                        onChange={(e) => handleChange('reward_points', e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">截止时间</label>
                    <input
                        className="form-input"
                        type="datetime-local"
                        value={form.deadline}
                        onChange={(e) => handleChange('deadline', e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">任务配图</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="file-input-hidden"
                        ref={fileRef}
                        onChange={handleImage}
                    />
                    {preview ? (
                        <div onClick={() => fileRef.current?.click()} style={{ cursor: 'pointer' }}>
                            <img src={preview} alt="预览" className="upload-preview" />
                            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>点击更换图片</p>
                        </div>
                    ) : (
                        <div className="upload-area" onClick={() => fileRef.current?.click()}>
                            <div className="upload-icon">📸</div>
                            <div className="upload-text">点击上传示例图片</div>
                        </div>
                    )}
                </div>

                <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? '发布中...' : '发布任务'}
                </button>
            </form>
        </div>
    );
}
