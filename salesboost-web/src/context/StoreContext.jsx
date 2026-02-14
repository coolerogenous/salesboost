import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if (!user) return; // Don't fetch if not logged in
        try {
            setLoading(true);
            const [usersRes, tasksRes, submissionsRes] = await Promise.all([
                api.get('/users/leaderboard'), // Everyone needs leaderboard
                api.get('/tasks'),
                api.get('/submissions')
            ]);

            setUsers(usersRes.data);
            setTasks(tasksRes.data);
            setSubmissions(submissionsRes.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAdminData = async () => {
        if (!user || user.role !== 'admin') return;
        try {
            // Admin might need full user list, handled by component or here?
            // Let's rely on components to fetch specific admin data if needed, or put it here.
            // For now, let's keep it simple. Leaderboard is mostly what's needed globally.
        } catch (e) { console.error(e); }
    }

    useEffect(() => {
        fetchData();
    }, [user]);

    // Actions
    const refreshData = fetchData;

    return (
        <StoreContext.Provider value={{
            users, tasks, submissions, loading, refreshData
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => useContext(StoreContext);
