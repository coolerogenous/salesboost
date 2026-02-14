import { useState } from 'react';
import { Clock, CheckCircle, XCircle, Upload, Image as ImageIcon } from 'lucide-react';

export default function TaskCard({ task, status, onSubmit }) {
    const [isExpanding, setIsExpanding] = useState(false);
    const [note, setNote] = useState('');
    const [hasImage, setHasImage] = useState(null); // File object

    const handleSubmit = () => {
        onSubmit(task.id, note, hasImage);
        setIsExpanding(false);
        setNote('');
        setHasImage(false);
    };

    return (
        <div className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden transition-all duration-300 ${status === 'expired' ? 'opacity-60 bg-gray-50' : ''}`}>
            <div className="flex justify-between items-start mb-2">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${status === 'expired' ? 'bg-gray-200 text-gray-500 border-gray-300' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                    {task.type}
                </span>
                <span className="font-bold text-orange-500 flex items-center text-sm">
                    +{task.points} 积分
                </span>
            </div>
            <h3 className="font-bold text-gray-800 text-base mb-1">{task.title}</h3>
            <p className="text-gray-500 text-xs mb-3 leading-relaxed">{task.desc}</p>

            {/* 任务图片展示 (如果管理员上传了) */}
            {task.taskImage && (
                <div className="mb-3 rounded-lg bg-gray-100 h-24 flex items-center justify-center border border-gray-200">
                    <ImageIcon className="text-gray-400 w-6 h-6 mr-1" />
                    <span className="text-gray-400 text-xs">任务示例图</span>
                </div>
            )}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={12} /> 截止: {task.deadline}
                </div>

                {/* 按钮状态逻辑 */}
                {(status === 'unclaimed' || status === 'rejected') && task.status === 'active' ? (
                    !isExpanding ? (
                        <button onClick={() => setIsExpanding(true)} className="px-4 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg shadow-sm hover:bg-blue-700 active:scale-95 transition">
                            {status === 'rejected' ? '重新提交' : '去完成'}
                        </button>
                    ) : null
                ) : (
                    <span className={`text-xs font-medium px-2 py-1 rounded flex items-center gap-1 ${status === 'approved' ? 'text-green-600 bg-green-50' :
                        status === 'expired' ? 'text-gray-500 bg-gray-200' :
                            'text-yellow-600 bg-yellow-50'
                        }`}>
                        {status === 'approved' ? <CheckCircle size={12} /> :
                            status === 'expired' ? <XCircle size={12} /> : <Clock size={12} />}
                        {status === 'approved' ? '已通过' :
                            status === 'expired' ? '已过期' : '审核中'}
                    </span>
                )}
            </div>

            {/* 提交表单展开区域 */}
            {isExpanding && (
                <div className="mt-3 pt-3 border-t border-blue-100 animate-fade-in-down bg-blue-50/50 rounded-lg p-3">
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-medium text-gray-600 mb-1 block">1. 上传截图凭证</label>
                            <div className="w-full h-16 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition relative overflow-hidden bg-gray-50 border-gray-300 hover:border-blue-400">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => setHasImage(e.target.files[0])}
                                />
                                {hasImage ? (
                                    <div className="text-green-600 flex items-center gap-1 text-xs font-bold">
                                        <CheckCircle size={14} />
                                        已选择: {hasImage.name.substring(0, 15)}...
                                    </div>
                                ) : (
                                    <>
                                        <ImageIcon className="text-gray-400 mb-1" size={20} />
                                        <span className="text-xs text-gray-400">点击上传图片</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-600 mb-1 block">2. 备注说明 (选填)</label>
                            <textarea
                                className="w-full text-xs p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                                rows="2"
                                placeholder="例如：已群发3个群，共计500人..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2 pt-1">
                            <button onClick={() => setIsExpanding(false)} className="flex-1 py-2 text-xs text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
                            <button
                                onClick={handleSubmit}
                                disabled={!hasImage}
                                className={`flex-1 py-2 text-xs text-white rounded-lg shadow flex items-center justify-center gap-1 ${!hasImage ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                <Upload size={12} /> 确认提交
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
