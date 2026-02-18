import { useState, useEffect } from 'react';
import api from '../../api';

export default function Leaderboard() {
    const [data, setData] = useState({ leaderboard: [], me: {} });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const res = await api.get('/staff/leaderboard');
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="page"><div className="loading"><div className="spinner"></div></div></div>;

    const { leaderboard, me } = data;
    const top3 = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3);

    // 重排 top3 的顺序为 2, 1, 3（展示用）
    const displayTop = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;

    return (
        <div className="page" style={{ paddingBottom: 140 }}>
            <div className="page-header">
                <h1 className="page-title">🏆 积分排行榜</h1>
            </div>

            {leaderboard.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🏆</div>
                    <div className="empty-text">暂无排行数据</div>
                </div>
            ) : (
                <>
                    {/* Top 3 */}
                    {top3.length > 0 && (
                        <div className="leaderboard-top">
                            {displayTop.map((user, idx) => {
                                const actualRank = idx === 0 ? 2 : idx === 1 ? 1 : 3;
                                if (!user) return null;
                                return (
                                    <div className="leaderboard-item" key={user.id} style={{ marginTop: actualRank === 1 ? 0 : 24 }}>
                                        <div className={`rank-badge rank-${actualRank}`}>{actualRank}</div>
                                        <div className="leaderboard-avatar" style={actualRank === 1 ? { width: 64, height: 64, fontSize: 22, background: 'linear-gradient(135deg, #F39C12, #E67E22)', boxShadow: '0 4px 16px rgba(243, 156, 18, 0.3)' } : {}}>
                                            {user.name?.[0]}
                                        </div>
                                        <div className="leaderboard-name">{user.name}</div>
                                        <div className="leaderboard-points">{user.points} 分</div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* 其余名次 */}
                    {rest.map((user, idx) => (
                        <div className="rank-list-item" key={user.id}>
                            <div className="rank-number">{idx + 4}</div>
                            <div className="rank-avatar-sm">{user.name?.[0]}</div>
                            <div className="rank-info">
                                <div className="rank-info-name">{user.name}</div>
                            </div>
                            <div className="rank-info-points">{user.points} 分</div>
                        </div>
                    ))}
                </>
            )}

            {/* 我的排名条 */}
            {me?.id && (
                <div className="my-rank-bar">
                    <div className="rank-number" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                        {me.rank || '-'}
                    </div>
                    <div className="rank-avatar-sm">{me.name?.[0]}</div>
                    <div className="rank-info">
                        <div className="rank-info-name">我</div>
                    </div>
                    <div className="rank-info-points" style={{ fontSize: 18, fontWeight: 700 }}>{me.points} 分</div>
                </div>
            )}
        </div>
    );
}
