import { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS, INITIAL_TASKS, INITIAL_SUBMISSIONS } from '../data/mock';

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
    const [users, setUsers] = useState(MOCK_USERS);
    const [tasks, setTasks] = useState(INITIAL_TASKS);
    const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
    const [currentUser, setCurrentUser] = useState(null);

    // Initialize expiry check
    useEffect(() => {
        const checkExpiry = () => {
            const today = new Date().toISOString().split('T')[0];
            setTasks(prev => prev.map(task => {
                if (task.status === 'active' && task.deadline < today) {
                    return { ...task, status: 'closed' };
                }
                return task;
            }));
        };
        checkExpiry();
    }, []);

    return (
        <StoreContext.Provider value={{
            users, setUsers,
            tasks, setTasks,
            submissions, setSubmissions,
            currentUser, setCurrentUser
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => useContext(StoreContext);
