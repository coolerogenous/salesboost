import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
    const { user } = useAuth();
    const isBoss = user?.role === 'boss';

    return (
        <div className="app-container">
            <Outlet />
            <nav className="bottom-nav">
                {isBoss ? (
                    <>
                        <NavLink to="/boss/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <span className="nav-icon">📋</span>
                            <span>任务</span>
                        </NavLink>
                        <NavLink to="/boss/review" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <span className="nav-icon">✅</span>
                            <span>审核</span>
                        </NavLink>
                        <NavLink to="/boss/staff" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <span className="nav-icon">👥</span>
                            <span>人员</span>
                        </NavLink>
                        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <span className="nav-icon">👤</span>
                            <span>我的</span>
                        </NavLink>
                    </>
                ) : (
                    <>
                        <NavLink to="/staff/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <span className="nav-icon">🏠</span>
                            <span>任务</span>
                        </NavLink>
                        <NavLink to="/staff/my-tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <span className="nav-icon">📝</span>
                            <span>我的</span>
                        </NavLink>
                        <NavLink to="/staff/leaderboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <span className="nav-icon">🏆</span>
                            <span>排行</span>
                        </NavLink>
                        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <span className="nav-icon">👤</span>
                            <span>我的</span>
                        </NavLink>
                    </>
                )}
            </nav>
        </div>
    );
}
