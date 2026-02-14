import { useState } from 'react';
import { BarChart3, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [inputId, setInputId] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = () => {
        const result = login(inputId, inputPassword);
        if (result.success) {
            navigate('/'); // Redirect to home/dashboard
        } else {
            setErrorMsg(result.message);
            setTimeout(() => setErrorMsg(''), 3000);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6 m-4">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg transform rotate-3">
                        <BarChart3 className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">助销云助手</h1>
                    <p className="text-gray-500 text-sm">企业内部销售效能管理系统</p>
                </div>

                {errorMsg && (
                    <div className="bg-red-50 text-red-500 text-sm p-2 rounded text-center">
                        {errorMsg}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">工号 / Employee ID</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={inputId}
                                onChange={(e) => setInputId(e.target.value)}
                                className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                                placeholder="请输入工号"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">密码 / Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={inputPassword}
                                onChange={(e) => setInputPassword(e.target.value)}
                                className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                                placeholder="请输入密码"
                            />
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleLogin}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition transform active:scale-95"
                    >
                        安全登录
                    </button>
                </div>

                <div className="pt-6 border-t border-gray-100">
                    <p className="text-xs text-center text-gray-400 mb-3">—— 快速测试入口 (预设密码: 123456) ——</p>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => { setInputId('1001'); setInputPassword('123456'); }} className="px-3 py-2 bg-gray-100 text-gray-600 text-xs rounded hover:bg-gray-200">
                            我是员工 (1001)
                        </button>
                        <button onClick={() => { setInputId('admin'); setInputPassword('admin'); }} className="px-3 py-2 bg-indigo-50 text-indigo-600 text-xs rounded hover:bg-indigo-100">
                            我是管理员 (admin)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
