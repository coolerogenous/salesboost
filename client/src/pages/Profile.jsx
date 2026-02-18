import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';
import api from '../api';

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showPwdForm, setShowPwdForm] = useState(false);
    const [oldPwd, setOldPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChangePwd = async (e) => {
        e.preventDefault();
        if (!oldPwd || !newPwd) {
            showToast('请填写旧密码和新密码', 'error');
            return;
        }
        setLoading(true);
        try {
            await api.put('/auth/password', { old_password: oldPwd, new_password: newPwd });
            showToast('密码修改成功', 'success');
            setShowPwdForm(false);
            setOldPwd('');
            setNewPwd('');
        } catch (err) {
            showToast(err.response?.data?.message || '修改失败', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className="page">
            <div className="profile-header">
                <div className="profile-avatar">
                    {user?.name?.[0] || '?'}
                </div>
                <div className="profile-name">{user?.name}</div>
                <div className="profile-id">工号：{user?.employee_id}</div>
                {user?.role === 'staff' && (
                    <div className="profile-points">
                        {user?.points || 0}
                        <div className="profile-points-label">累计积分</div>
                    </div>
                )}
            </div>

            {/* 修改密码 */}
            <div className="card" onClick={() => !showPwdForm && setShowPwdForm(true)} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600 }}>🔒 修改密码</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{showPwdForm ? '' : '>'}</span>
                </div>

                {showPwdForm && (
                    <form onSubmit={handleChangePwd} style={{ marginTop: 16 }} onClick={(e) => e.stopPropagation()}>
                        <div className="form-group">
                            <input
                                className="form-input"
                                type="password"
                                placeholder="旧密码"
                                value={oldPwd}
                                onChange={(e) => setOldPwd(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                className="form-input"
                                type="password"
                                placeholder="新密码"
                                value={newPwd}
                                onChange={(e) => setNewPwd(e.target.value)}
                            />
                        </div>
                        <div className="btn-group">
                            <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowPwdForm(false)}>取消</button>
                            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                                {loading ? '保存中...' : '确认修改'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* 退出登录 */}
            <button className="btn btn-danger" onClick={handleLogout} style={{ marginTop: 16 }}>
                退出登录
            </button>
        </div>
    );
}
