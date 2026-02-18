import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';

export default function Login() {
    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!employeeId.trim() || !password.trim()) {
            showToast('请输入工号和密码', 'error');
            return;
        }

        setLoading(true);
        try {
            const user = await login(employeeId.trim(), password);
            showToast('登录成功', 'success');
            navigate(user.role === 'boss' ? '/boss/tasks' : '/staff/tasks', { replace: true });
        } catch (err) {
            showToast(err.response?.data?.message || '登录失败', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    <div className="login-logo-icon">🚀</div>
                    <h1>助销云助手</h1>
                    <p>SalesBoost</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">工号</label>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="请输入工号"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            autoComplete="username"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">密码</label>
                        <input
                            className="form-input"
                            type="password"
                            placeholder="请输入密码"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={loading}
                        style={{ marginTop: 8 }}
                    >
                        {loading ? '登录中...' : '登 录'}
                    </button>
                </form>
            </div>
        </div>
    );
}
