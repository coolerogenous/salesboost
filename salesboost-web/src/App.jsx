import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import Login from './pages/Login';
import MobileShell from './components/layout/MobileShell';
import BottomNav from './components/layout/BottomNav';

// Employee Pages
import EmployeeTaskHall from './pages/Employee/TaskHall';
import Leaderboard from './pages/Employee/Leaderboard';
import EmployeeProfile from './pages/Employee/Profile';

// Admin Pages
import AdminAudit from './pages/Admin/Audit';
import AdminTaskMgr from './pages/Admin/TaskMgr';
import AdminUserMgr from './pages/Admin/UserMgr';
import AdminStats from './pages/Admin/Stats';

function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/login" replace />;
  return children;
}

function LayoutWrapper() {
  const { user } = useAuth();
  const { submissions } = useStore();
  const pendingCount = submissions.filter(s => s.status === 'pending').length;

  if (!user) return <Navigate to="/login" />;

  return (
    <MobileShell>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <Routes>
            {/* Employee Routes */}
            <Route path="/employee/tasks" element={<EmployeeTaskHall />} />
            <Route path="/employee/rank" element={<Leaderboard />} />
            <Route path="/employee/profile" element={<EmployeeProfile />} />

            {/* Admin Routes */}
            <Route path="/admin/audit" element={<AdminAudit />} />
            <Route path="/admin/tasks" element={<AdminTaskMgr />} />
            <Route path="/admin/users" element={<AdminUserMgr />} />
            <Route path="/admin/stats" element={<AdminStats />} />

            {/* Default Redirects within Layout */}
            <Route path="*" element={<Navigate to={user.role === 'admin' ? "/admin/audit" : "/employee/tasks"} replace />} />
          </Routes>
        </div>
        <BottomNav role={user.role} pendingCount={pendingCount} />
      </div>
    </MobileShell>
  );
}

function AppContent() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && window.location.pathname !== '/login') {
      navigate('/login');
    } else if (user && window.location.pathname === '/login') {
      navigate(user.role === 'admin' ? '/admin/audit' : '/employee/tasks');
    }
  }, [user, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<MobileShell><Login /></MobileShell>} />
      <Route path="/*" element={<LayoutWrapper />} />
    </Routes>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </StoreProvider>
  );
}
