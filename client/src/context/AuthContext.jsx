import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 启动时验证 token 是否有效
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }
        // 向后端验证 token
        api.get('/auth/profile')
            .then(res => {
                const userData = res.data;
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
            })
            .catch(() => {
                // token 无效或过期，清除并跳转登录
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const login = async (employee_id, password) => {
        const res = await api.post('/auth/login', { employee_id, password });
        const { token, user: userData } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateUser = (data) => {
        const updated = { ...user, ...data };
        localStorage.setItem('user', JSON.stringify(updated));
        setUser(updated);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
