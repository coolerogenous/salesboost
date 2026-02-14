import { ShieldCheck, User, Bell, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

export default function MobileShell({ children }) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 font-sans text-gray-800">
            {/* 手机外壳模拟 - 移动端全屏，PC端保持模拟框 */}
            <div className="relative w-full h-[100dvh] md:max-w-md md:h-[850px] bg-gray-50 md:shadow-2xl overflow-hidden flex flex-col md:rounded-3xl border-0 md:border border-gray-200">

                {/* 顶部状态栏 - 仅在登录后显示 */}
                {!isLoginPage && user && (
                    <div className={`h-14 ${user.role === 'admin' ? 'bg-indigo-900' : 'bg-blue-600'} text-white flex items-center justify-between px-4 shrink-0 shadow-md z-10`}>
                        <div className="font-bold text-lg tracking-wide flex items-center gap-2">
                            {user.role === 'admin' ? <ShieldCheck size={20} /> : <User size={20} />}
                            {user.role === 'admin' ? '助销云·管理端' : '助销云·员工端'}
                        </div>
                        <button onClick={logout} className="text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition">
                            退出
                        </button>
                    </div>
                )}

                {/* 主内容区域 - 可滚动 */}
                <div className="flex-1 overflow-y-auto no-scrollbar relative bg-gray-50">
                    {children}
                </div>

                {/* 全局 Toast 通知占位 (实际应用可能使用 Context 或 Toaster) */}
                {/*
        {notification && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-fade-in-down z-50 flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle size={16} className="text-green-400"/> : <Bell size={16} />}
            {notification.msg}
          </div>
        )}
        */}
            </div>
        </div>
    );
}
