import { useState, useEffect } from 'react';
import api from '../../api';
import { showToast } from '../../components/Toast';

export default function StaffManage() {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ employee_id: '', name: '', password: '' });
    const [addLoading, setAddLoading] = useState(false);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const res = await api.get('/boss/staff');
            setStaff(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!form.employee_id || !form.name || !form.password) {
            showToast('请填写完整信息', 'error');
            return;
        }
        setAddLoading(true);
        try {
            await api.post('/boss/staff', form);
            showToast('员工添加成功', 'success');
            setShowAdd(false);
            setForm({ employee_id: '', name: '', password: '' });
            fetchStaff();
        } catch (err) {
            showToast(err.response?.data?.message || '添加失败', 'error');
        } finally {
            setAddLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`确定要删除员工 "${name}" 吗？`)) return;
        try {
            await api.delete(`/boss/staff/${id}`);
            showToast('已删除', 'success');
            fetchStaff();
        } catch (err) {
            showToast(err.response?.data?.message || '删除失败', 'error');
        }
    };

    if (loading) return <div className="page"><div className="loading"><div className="spinner"></div></div></div>;

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">人员管理</h1>
                <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
                    + 添加员工
                </button>
            </div>

            {staff.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">👥</div>
                    <div className="empty-text">暂无员工</div>
                </div>
            ) : (
                staff.map(s => (
                    <div className="card" key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="rank-avatar-sm">{s.name?.[0]}</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: 15 }}>{s.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>工号：{s.employee_id}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--gold)' }}>{s.points}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>积分</div>
                        </div>
                        <button
                            className="btn btn-danger btn-sm"
                            style={{ width: 'auto', padding: '6px 12px', fontSize: 12 }}
                            onClick={() => handleDelete(s.id, s.name)}
                        >
                            删除
                        </button>
                    </div>
                ))
            )}

            {/* 添加员工弹窗 */}
            {showAdd && (
                <div className="modal-overlay" onClick={() => setShowAdd(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-title">添加新员工</div>
                        <form onSubmit={handleAdd}>
                            <div className="form-group">
                                <label className="form-label">工号</label>
                                <input
                                    className="form-input"
                                    placeholder="请输入工号"
                                    value={form.employee_id}
                                    onChange={e => setForm(p => ({ ...p, employee_id: e.target.value }))}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">姓名</label>
                                <input
                                    className="form-input"
                                    placeholder="请输入姓名"
                                    value={form.name}
                                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">初始密码</label>
                                <input
                                    className="form-input"
                                    type="password"
                                    placeholder="请设置初始密码"
                                    value={form.password}
                                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                />
                            </div>
                            <div className="btn-group">
                                <button type="button" className="btn btn-outline" onClick={() => setShowAdd(false)}>取消</button>
                                <button type="submit" className="btn btn-primary" disabled={addLoading}>
                                    {addLoading ? '添加中...' : '确认添加'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
