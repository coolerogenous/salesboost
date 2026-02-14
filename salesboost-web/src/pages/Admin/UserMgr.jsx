import { useState } from 'react';
import { Plus, XCircle, Lock, Edit, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import { useStore } from '../../context/StoreContext';

export default function AdminUserMgr() {
    const { users, refreshData } = useStore();
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ id: '', name: '', role: 'employee', password: '' });

    const resetForm = () => {
        setFormData({ id: '', name: '', role: 'employee', password: '' });
        setIsEditing(false);
        setShowForm(false);
    };

    const startEdit = (user) => {
        setFormData({ ...user, password: '' }); // 编辑时不自动回填密码，除非想修改
        setIsEditing(true);
        setShowForm(true);
    };

    const handleSubmit = async () => {
        if (!formData.id || !formData.name) return;

        const userToSubmit = { ...formData };
        if (isEditing && !userToSubmit.password) {
            delete userToSubmit.password;
        }

        try {
            if (isEditing) {
                // await api.put(`/users/${userToSubmit.id}`, userToSubmit);
                alert('修改功能后端尚未完全实现，请先删除再添加');
                return;
            } else {
                await api.post('/users', userToSubmit);
                alert('人员添加成功');
            }
            await refreshData();
            resetForm();
        } catch (error) {
            alert('操作失败: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('确定要删除该人员吗？此操作不可恢复。')) {
            try {
                await api.delete(`/users/${userId}`);
                await refreshData();
            } catch (error) {
                alert('删除失败: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    // 过滤掉当前管理员自己，防止误删
    const managedUsers = users.filter(u => u.id !== 'admin');

    return (
        <div className="p-4 pb-20">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">人员管理</h2>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 shadow hover:bg-indigo-700"
                >
                    <Plus size={16} /> 添加员工
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-4 rounded-xl shadow-lg border border-indigo-100 mb-6 animate-fade-in-down">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-bold text-gray-800">{isEditing ? '编辑员工' : '录入新员工'}</h3>
                        <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><XCircle size={18} /></button>
                    </div>
                    <div className="space-y-3">
                        <input
                            placeholder="姓名"
                            className="w-full text-sm border p-2 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                        <input
                            placeholder="工号 (ID)"
                            className="w-full text-sm border p-2 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                            value={formData.id}
                            onChange={e => setFormData({ ...formData, id: e.target.value })}
                            disabled={isEditing} // 工号通常作为主键不可修改
                        />
                        <div className="relative">
                            <input
                                placeholder={isEditing ? "密码 (留空则不修改)" : "密码 (默认为 123456)"}
                                className="w-full text-sm border p-2 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                            <Lock size={14} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <select
                            className="w-full text-sm border p-2 rounded"
                            value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="employee">普通员工</option>
                            <option value="admin">管理员</option>
                        </select>
                        <button onClick={handleSubmit} className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:opacity-90">
                            {isEditing ? '保存修改' : '确认添加'}
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {managedUsers.map((u) => (
                    <div key={u.id} className="p-4 border-b border-gray-100 flex justify-between items-center last:border-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                                {u.avatar || '👤'}
                            </div>
                            <div>
                                <div className="font-medium text-gray-800 text-sm">{u.name}</div>
                                <div className="text-xs text-gray-500">工号: {u.id} | {u.role === 'admin' ? '管理员' : '员工'}</div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => startEdit(u)} className="p-2 text-gray-400 hover:text-indigo-600 bg-gray-50 rounded-lg">
                                <Edit size={16} />
                            </button>
                            <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 rounded-lg">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
                {managedUsers.length === 0 && (
                    <div className="p-6 text-center text-gray-400 text-sm">暂无员工数据</div>
                )}
            </div>
        </div>
    );
}
