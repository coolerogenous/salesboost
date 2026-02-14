import { createContext, useContext, useState } from 'react';
import { MOCK_USERS } from '../data/mock';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userId, password) => {
        const foundUser = MOCK_USERS.find(u => u.id === userId);
        if (!foundUser) return { success: false, message: '工号不存在，请联系管理员' };
        if (foundUser.password !== password) return { success: false, message: '密码错误，请重试' };

        setUser(foundUser);
        return { success: true, message: `欢迎回来，${foundUser.name}` };
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUserPoints: () => { } }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
