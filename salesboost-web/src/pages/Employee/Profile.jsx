import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

export default function EmployeeProfile() {
    const { user } = useAuth();
    const { submissions } = useStore();

    const mySubs = submissions.filter(s => s.userId === user.id);
    const approvedCount = mySubs.filter(s => s.status === 'approved').length;

    return (
        <div className="pb-20">
            <div className="bg-white p-6 mb-4 border-b border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-blue-100 text-4xl rounded-full flex items-center justify-center">
                        {user.avatar}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                        <p className="text-sm text-gray-500">工号: {user.id} | 销售一部</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl text-center">
                        <div className="text-xs text-blue-600 mb-1">当前绩效分</div>
                        <div className="text-2xl font-bold text-blue-700">{user.points}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl text-center">
                        <div className="text-xs text-green-600 mb-1">已完成任务</div>
                        <div className="text-2xl font-bold text-green-700">{approvedCount}</div>
                    </div>
                </div>
            </div>

            <div className="px-4">
                <h3 className="font-bold text-gray-800 mb-3 text-sm">最近动态</h3>
                <div className="space-y-3">
                    {mySubs.length === 0 ? <p className="text-gray-400 text-xs">暂无记录</p> : mySubs.map(sub => (
                        <div key={sub.id} className="bg-white p-3 rounded-lg border border-gray-100 flex justify-between items-center">
                            <div>
                                <div className="text-sm font-medium text-gray-700">提交了任务 #{sub.taskId}</div>
                                <div className="text-xs text-gray-400">{sub.time}</div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${sub.status === 'approved' ? 'bg-green-100 text-green-700' :
                                sub.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {sub.status === 'approved' ? '审核通过' : sub.status === 'pending' ? '审核中' : '已驳回'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
