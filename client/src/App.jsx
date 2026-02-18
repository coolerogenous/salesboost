import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Layout from './components/Layout';
import Login from './pages/Login';
import Profile from './pages/Profile';
import BossTaskList from './pages/boss/TaskList';
import BossTaskCreate from './pages/boss/TaskCreate';
import ReviewList from './pages/boss/ReviewList';
import StaffManage from './pages/boss/StaffManage';
import StaffTaskHall from './pages/staff/TaskHall';
import StaffTaskDetail from './pages/staff/TaskDetail';
import Leaderboard from './pages/staff/Leaderboard';
import MyTasks from './pages/staff/MyTasks';

function PrivateRoute({ children, role }) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    if (role && user.role !== role) {
        return <Navigate to={user.role === 'boss' ? '/boss/tasks' : '/staff/tasks'} replace />;
    }
    return children;
}

export default function App() {
    const { user, loading } = useAuth();

    // token 验证中，显示加载状态
    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-primary)' }}>
                <div className="spinner"></div>
            </div>
        );
    }
    return (
        <ToastProvider>
            <Routes>
                <Route path="/login" element={user ? <Navigate to={user.role === 'boss' ? '/boss/tasks' : '/staff/tasks'} replace /> : <Login />} />

                <Route path="/" element={
                    <PrivateRoute><Layout /></PrivateRoute>
                }>
                    {/* 老板端 */}
                    <Route path="boss/tasks" element={<PrivateRoute role="boss"><BossTaskList /></PrivateRoute>} />
                    <Route path="boss/tasks/create" element={<PrivateRoute role="boss"><BossTaskCreate /></PrivateRoute>} />
                    <Route path="boss/review" element={<PrivateRoute role="boss"><ReviewList /></PrivateRoute>} />
                    <Route path="boss/staff" element={<PrivateRoute role="boss"><StaffManage /></PrivateRoute>} />

                    {/* 员工端 */}
                    <Route path="staff/tasks" element={<PrivateRoute role="staff"><StaffTaskHall /></PrivateRoute>} />
                    <Route path="staff/tasks/:id" element={<PrivateRoute role="staff"><StaffTaskDetail /></PrivateRoute>} />
                    <Route path="staff/my-tasks" element={<PrivateRoute role="staff"><MyTasks /></PrivateRoute>} />
                    <Route path="staff/leaderboard" element={<PrivateRoute role="staff"><Leaderboard /></PrivateRoute>} />

                    {/* 个人中心 */}
                    <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                </Route>

                {/* 默认重定向 */}
                <Route path="*" element={
                    user ? <Navigate to={user.role === 'boss' ? '/boss/tasks' : '/staff/tasks'} replace /> : <Navigate to="/login" replace />
                } />
            </Routes>
        </ToastProvider>
    );
}
