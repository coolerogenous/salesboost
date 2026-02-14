import { useState } from 'react';
import { Plus, XCircle, CheckCircle, ImageIcon, Edit, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import { useStore } from '../../context/StoreContext';

export default function AdminTaskMgr() {
    const { tasks, refreshData } = useStore();
    const [isEditing, setIsEditing] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [taskFilter, setTaskFilter] = useState('active'); // active, closed
    const [formData, setFormData] = useState({ id: null, title: '', desc: '', points: 10, deadline: '', type: '朋友圈', taskImage: null });

    const resetForm = () => {
        setFormData({ id: null, title: '', desc: '', points: 10, deadline: '', type: '朋友圈', taskImage: null });
        setIsEditing(false);
        setShowForm(false);
    };

    const startEdit = (task) => {
        setFormData(task);
        setIsEditing(true);
        setShowForm(true);
    };

    const handleSubmit = async () => {
        if (!formData.title) return;

        try {
            const taskData = {
                ...formData,
                status: isEditing ? formData.status : 'active'
            };

            if (isEditing) {
                await api.put(`/tasks/${formData.id}`, taskData);
                alert('任务更新成功');
            } else {
                await api.post('/tasks', taskData);
                alert('任务发布成功');
            }

            await refreshData();
            resetForm();
        } catch (error) {
            alert('操作失败: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('确定要删除这个任务吗？')) {
            try {
                await api.delete(`/tasks/${taskId}`);
                await refreshData();
            } catch (error) {
                alert('删除失败: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const displayedTasks = tasks.filter(t => taskFilter === 'active' ? t.status === 'active' : t.status === 'closed');

    return (
        <div className="p-4 pb-20">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">任务管理</h2>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 shadow hover:bg-indigo-700"
                >
                    <Plus size={16} /> 发布任务
                </button>
            </div>

            <div className="flex bg-white p-1 rounded-lg shadow-sm border border-gray-100 mb-4">
                <button onClick={() => setTaskFilter('active')} className={`flex-1 py-1.5 text-xs font-medium rounded transition ${taskFilter === 'active' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500'}`}>
                    进行中
                </button>
                <button onClick={() => setTaskFilter('closed')} className={`flex-1 py-1.5 text-xs font-medium rounded transition ${taskFilter === 'closed' ? 'bg-gray-200 text-gray-700' : 'text-gray-500'}`}>
                    已结束/过期
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-4 rounded-xl shadow-lg border border-indigo-100 mb-6 animate-fade-in-down z-20 relative">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-bold text-gray-800">{isEditing ? '编辑任务' : '新建任务'}</h3>
                        <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><XCircle size={18} /></button>
                    </div>
                    <div className="space-y-3">
                        <input
                            placeholder="任务标题"
                            className="w-full text-sm border p-2 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                            value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                        <textarea
                            placeholder="任务描述..."
                            className="w-full text-sm border p-2 rounded h-20 focus:ring-1 focus:ring-indigo-500 outline-none"
                            value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })}
                        />
                        {/* 模拟上传图片 */}
                        <div
                            className={`border-2 border-dashed rounded p-3 text-center cursor-pointer ${formData.taskImage ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300'}`}
                            onClick={() => setFormData({ ...formData, taskImage: formData.taskImage ? null : 'placeholder_url' })}
                        >
                            {formData.taskImage ? (
                                <span className="text-xs text-indigo-600 flex items-center justify-center gap-1"><CheckCircle size={12} /> 已添加示例图 (点击移除)</span>
                            ) : (
                                <span className="text-xs text-gray-400 flex items-center justify-center gap-1"><ImageIcon size={12} /> 添加任务示例图 (选填)</span>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="number" placeholder="积分"
                                className="w-1/3 text-sm border p-2 rounded"
                                value={formData.points} onChange={e => setFormData({ ...formData, points: parseInt(e.target.value) })}
                            />
                            <select
                                className="w-2/3 text-sm border p-2 rounded"
                                value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option>朋友圈</option>
                                <option>社群</option>
                                <option>私信</option>
                                <option>其他</option>
                            </select>
                        </div>
                        <input
                            type="date"
                            className="w-full text-sm border p-2 rounded"
                            value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                        />
                        <button onClick={handleSubmit} className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:opacity-90">
                            {isEditing ? '保存修改' : '确认发布'}
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {displayedTasks.length === 0 ? <p className="text-center text-gray-400 text-sm py-4">暂无{taskFilter === 'active' ? '进行中' : '已结束'}任务</p> : displayedTasks.map(task => (
                    <div key={task.id} className={`bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-start ${task.status === 'closed' ? 'opacity-70 bg-gray-50' : ''}`}>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="font-bold text-gray-800 text-sm">{task.title}</div>
                                {task.taskImage && <ImageIcon size={12} className="text-indigo-400" />}
                            </div>
                            <div className="text-xs text-gray-500 mb-1 line-clamp-2">{task.desc}</div>
                            <div className="text-xs text-indigo-600 font-medium flex items-center gap-2">
                                <span>{task.points}分</span>
                                <span>|</span>
                                <span>{task.type}</span>
                                <span>|</span>
                                <span className={task.status === 'closed' ? 'text-red-500' : ''}>截止: {task.deadline}</span>
                            </div>
                        </div>
                        <div className="flex gap-2 ml-2">
                            <button onClick={() => startEdit(task)} className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                                <Edit size={14} />
                            </button>
                            <button onClick={() => handleDeleteTask(task.id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
