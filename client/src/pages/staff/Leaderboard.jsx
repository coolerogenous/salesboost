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

    return (
        <div className="page" style={{ paddingBottom: 140 }}>
            <div className="page-header">
                <h1 className="page-title">积分风云榜</h1>
            </div>

            {leaderboard.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🏆</div>
                    <div className="empty-text">暂无排行数据</div>
                </div>
            ) : (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    {leaderboard.map((user, idx) => {
                        const rank = idx + 1;
                        let rankDisplay;
                        if (rank === 1) rankDisplay = <span style={{ fontSize: 24 }}>🥇</span>;
                        else if (rank === 2) rankDisplay = <span style={{ fontSize: 24 }}>🥈</span>;
                        else if (rank === 3) rankDisplay = <span style={{ fontSize: 24 }}>🥉</span>;
                        else rankDisplay = <span className="rank-number">{rank}</span>;

                        return (
                            <div className="rank-list-item" key={user.id}>
                                <div style={{ width: 40, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                                    {rankDisplay}
                                </div>
                                <div className="rank-avatar-sm">{user.name?.[0]}</div>
                                <div className="rank-info">
                                    <div className="rank-info-name">{user.name}</div>
                                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>工号 {user.employee_id}</div>
                                </div>
                                <div className="rank-info-points" style={{ fontWeight: 700, fontSize: 17 }}>
                                    {user.points} <span style={{ fontSize: 12, fontWeight: 500 }}>分</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* 我的排名条 */}
            {me?.id && (
                <div className="my-rank-bar">
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--primary)', width: 30, textAlign: 'center' }}>
                        {me.rank || '-'}
                    </div>
                    <div className="rank-avatar-sm" style={{ width: 36, height: 36, fontSize: 14 }}>{me.name?.[0]}</div>
                    <div className="rank-info">
                        <div className="rank-info-name" style={{ fontSize: 15 }}>我</div>
                    </div>
                    <div className="rank-info-points" style={{ fontSize: 17, fontWeight: 700 }}>{me.points} 分</div>
                </div>
            )}
        </div>
    );
}
