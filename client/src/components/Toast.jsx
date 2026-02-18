import { useState, useEffect, useCallback } from 'react';

let toastTimer = null;

export default function Toast({ message, type, onClose }) {
    useEffect(() => {
        if (message) {
            toastTimer = setTimeout(() => {
                onClose();
            }, 2500);
        }
        return () => clearTimeout(toastTimer);
    }, [message]);

    if (!message) return null;

    return (
        <div className={`toast toast-${type}`}>
            {message}
        </div>
    );
}

// 全局 toast hook
let globalSetToast = null;

export function ToastProvider({ children }) {
    const [toast, setToast] = useState({ message: '', type: 'success' });
    globalSetToast = setToast;

    return (
        <>
            {children}
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ message: '', type: 'success' })}
            />
        </>
    );
}

export function showToast(message, type = 'success') {
    if (globalSetToast) {
        globalSetToast({ message, type });
    }
}
