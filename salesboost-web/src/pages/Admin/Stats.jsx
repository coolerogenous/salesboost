import { Download as DownloadIcon } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function AdminStats() {
    const { users } = useStore();

    return (
        <div className="p-4 pb-20">
            <h2 className="text-lg font-bold text-gray-800 mb-4">数据报表</h2>
            <div className="bg-indigo-600 rounded-xl p-6 text-white mb-4 shadow-lg">
                <div className="text-indigo-200 text-sm mb-1">团队总积分产出</div>
                <div className="text-3xl font-bold">{users.reduce((acc, curr) => acc + curr.points, 0)}</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="p-3">姓名</th>
                            <th className="p-3">工号</th>
                            <th className="p-3 text-right">积分</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.filter(u => u.role !== 'admin').map((u) => (
                            <tr key={u.id} className="border-t border-gray-100">
                                <td className="p-3 font-medium">{u.name}</td>
                                <td className="p-3 text-gray-500">{u.id}</td>
                                <td className="p-3 text-right font-bold text-indigo-600">{u.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="p-3 border-t border-gray-100 text-center">
                    <button className="text-xs text-indigo-600 font-medium flex items-center justify-center gap-1 w-full">
                        <DownloadIcon size={12} /> 导出 Excel 报表
                    </button>
                </div>
            </div>
        </div>
    );
}
