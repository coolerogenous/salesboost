import { CheckCircle, FileText, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function AdminAudit() {
    const { submissions, setSubmissions, tasks, users, setUsers } = useStore();
    const pendingList = submissions.filter(s => s.status === 'pending');

    const handleAudit = (submissionId, status) => {
        const targetSub = submissions.find(s => s.id === submissionId);
        if (!targetSub) return;

        // 更新提交状态
        const updatedSubmissions = submissions.map(s =>
            s.id === submissionId ? { ...s, status } : s
        );
        setSubmissions(updatedSubmissions);

        // 如果通过，加积分
        if (status === 'approved') {
            const task = tasks.find(t => t.id === targetSub.taskId);
            const pointsToAdd = task ? task.points : 0;

            const updatedUsers = users.map(u =>
                u.id === targetSub.userId ? { ...u, points: u.points + pointsToAdd } : u
            );
            setUsers(updatedUsers);
            alert(`审核通过，${targetSub.userName} 积分 +${pointsToAdd}`);
        } else {
            alert('已驳回该申请');
        }
    };

    return (
        <div className="p-4 pb-20">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center justify-between">
                待审核凭证
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{pendingList.length}</span>
            </h2>

            {pendingList.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-gray-500">所有任务已审核完毕</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {pendingList.map(sub => {
                        const task = tasks.find(t => t.id === sub.taskId);
                        return (
                            <div key={sub.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-3 border-b border-gray-50 bg-gray-50 flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-700">{sub.userName}</span>
                                    <span className="text-xs text-gray-400">{sub.time.split(' ')[0]}</span>
                                </div>
                                <div className="p-4">
                                    <p className="text-xs text-gray-500 mb-2 font-bold">关联任务: {task?.title}</p>

                                    {sub.note && (
                                        <div className="bg-yellow-50 p-2 rounded text-xs text-gray-600 mb-3 border border-yellow-100 flex items-start gap-1">
                                            <FileText size={12} className="mt-0.5 shrink-0 text-yellow-600" />
                                            <span><span className="font-bold">员工备注：</span>{sub.note}</span>
                                        </div>
                                    )}

                                    <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4 border border-dashed border-gray-300 relative group">
                                        <div className="text-gray-400 text-xs flex flex-col items-center">
                                            <ImageIcon size={24} className="mb-1" />
                                            [截图凭证预览]
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleAudit(sub.id, 'rejected')}
                                            className="flex-1 py-2 border border-red-200 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50"
                                        >
                                            驳回
                                        </button>
                                        <button
                                            onClick={() => handleAudit(sub.id, 'approved')}
                                            className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-md shadow-indigo-200"
                                        >
                                            通过
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
