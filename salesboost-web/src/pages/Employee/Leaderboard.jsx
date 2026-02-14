import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

export default function Leaderboard() {
    const { users } = useStore();
    const { user: currentUser } = useAuth();

    const sortedUsers = [...users].filter(u => u.role !== 'admin').sort((a, b) => b.points - a.points);

    return (
        <div className="pb-20">
            <div className="bg-blue-600 p-6 pb-12 rounded-b-3xl text-white text-center shadow-lg mb-[-30px]">
                <h2 className="text-2xl font-bold mb-1">🏆 销冠排行榜</h2>
                <p className="text-blue-100 text-xs opacity-80">每月1号结算绩效</p>
            </div>

            <div className="px-4 space-y-3">
                {sortedUsers.map((u, index) => {
                    const isMe = u.id === currentUser.id;
                    return (
                        <div key={u.id} className={`flex items-center p-4 rounded-xl shadow-sm border ${isMe ? 'bg-yellow-50 border-yellow-200 transform scale-105 ring-2 ring-yellow-100 z-10' : 'bg-white border-gray-100'}`}>
                            <div className={`w-8 font-bold text-center ${index < 3 ? 'text-yellow-500 text-xl italic' : 'text-gray-400'}`}>
                                {index + 1}
                            </div>
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl mx-3">
                                {u.avatar}
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-gray-800 text-sm">{u.name} {isMe && <span className="text-xs text-blue-500 font-normal">(我)</span>}</div>
                                <div className="text-xs text-gray-400">工号: {u.id}</div>
                            </div>
                            <div className="font-bold text-blue-600 text-lg">{u.points}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
