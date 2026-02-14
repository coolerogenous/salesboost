import { ClipboardList, Trophy, User, CheckCircle, Users, BarChart3 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav({ role, pendingCount }) {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname.includes(path);

    const navItemClass = (path) =>
        `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive(path) ? (role === 'admin' ? 'text-indigo-600' : 'text-blue-600') : 'text-gray-400'}`;

    if (role === 'admin') {
        return (
            <div className="h-16 bg-white border-t border-gray-200 flex justify-around items-center shrink-0 z-20">
                <button onClick={() => navigate('/admin/audit')} className={navItemClass('audit')}>
                    <div className="relative">
                        <CheckCircle size={24} />
                        {pendingCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">{pendingCount}</span>}
                    </div>
                    <span className="text-[10px]">审核</span>
                </button>
                <button onClick={() => navigate('/admin/tasks')} className={navItemClass('tasks')}>
                    <ClipboardList size={24} />
                    <span className="text-[10px]">任务</span>
                </button>
                <button onClick={() => navigate('/admin/users')} className={navItemClass('users')}>
                    <Users size={24} />
                    <span className="text-[10px]">人员</span>
                </button>
                <button onClick={() => navigate('/admin/stats')} className={navItemClass('stats')}>
                    <BarChart3 size={24} />
                    <span className="text-[10px]">报表</span>
                </button>
            </div>
        );
    }

    return (
        <div className="h-16 bg-white border-t border-gray-200 flex justify-around items-center shrink-0 z-20">
            <button onClick={() => navigate('/employee/tasks')} className={navItemClass('tasks')}>
                <ClipboardList size={24} />
                <span className="text-[10px]">任务大厅</span>
            </button>
            <button onClick={() => navigate('/employee/rank')} className={navItemClass('rank')}>
                <Trophy size={24} />
                <span className="text-[10px]">龙虎榜</span>
            </button>
            <button onClick={() => navigate('/employee/profile')} className={navItemClass('profile')}>
                <User size={24} />
                <span className="text-[10px]">我的</span>
            </button>
        </div>
    );
}
