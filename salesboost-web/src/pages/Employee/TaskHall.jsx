import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import TaskCard from '../../components/business/TaskCard';

export default function TaskHall() {
    const { tasks, submissions, setSubmissions } = useStore();
    const { user } = useAuth();
    const [filter, setFilter] = useState('todo'); // todo, done

    const handleSubmitProof = (taskId, note, imageFile) => {
        const newSubmission = {
            id: Date.now(),
            taskId,
            userId: user.id,
            userName: user.name,
            status: 'pending',
            imageUrl: imageFile ? 'uploaded_image' : 'placeholder', // 模拟图片
            note: note || '',
            time: new Date().toLocaleString()
        };
        setSubmissions([newSubmission, ...submissions]);
        alert('凭证提交成功，等待审核'); // Simple alert for now, can be upgraded to Toast
    };

    const getTaskStatus = (task) => {
        // 如果任务是关闭状态，且用户没有完成它，那么对用户来说也是不可做的
        const sub = submissions.find(s => s.taskId === task.id && s.userId === user.id);

        if (task.status === 'closed') {
            if (!sub) return 'expired'; // 过期未完成
        }

        if (!sub) return 'unclaimed';
        return sub.status;
    };

    const displayedTasks = tasks.filter(task => {
        const status = getTaskStatus(task);
        if (filter === 'todo') {
            // 待办：未领取且任务未过期，或者被驳回
            return (status === 'unclaimed' && task.status === 'active') || status === 'rejected';
        }
        if (filter === 'done') {
            // 已办：审核中、已通过、或者已过期
            return status === 'pending' || status === 'approved';
        }
        return true;
    });

    return (
        <div className="p-4 space-y-4 pb-20">
            <div className="flex bg-white p-1 rounded-lg shadow-sm border border-gray-100">
                <button
                    onClick={() => setFilter('todo')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition ${filter === 'todo' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}
                >
                    待办任务
                </button>
                <button
                    onClick={() => setFilter('done')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition ${filter === 'done' ? 'bg-green-100 text-green-700' : 'text-gray-500'}`}
                >
                    已办/审核
                </button>
            </div>

            <div className="space-y-4">
                {displayedTasks.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        <ClipboardList className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">暂无任务</p>
                    </div>
                ) : (
                    displayedTasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            status={getTaskStatus(task)}
                            onSubmit={handleSubmitProof}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
