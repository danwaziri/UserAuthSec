import React, { useEffect, useState } from 'react';
import { getAdminStats, getAdminUsers, toggleUserStatus } from '../services/adminService';
import {
    Users,
    ShieldAlert,
    Activity,
    Unlock,
    Lock,
    ExternalLink,
    Search,
    AlertCircle,
    CheckCircle2,
    Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboardPage: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        try {
            const [statsRes, usersRes] = await Promise.all([
                getAdminStats(),
                getAdminUsers()
            ]);

            if (statsRes.success) {
                setStats(statsRes.data.stats);
                setAlerts(statsRes.data.recentAlerts);
            }
            if (usersRes.success) {
                setUsers(usersRes.data);
            }
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleToggleStatus = async (userId: number, currentStatus: boolean) => {
        try {
            await toggleUserStatus(userId, !currentStatus);
            fetchData();
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading-screen">Loading Intelligence...</div>;

    return (
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                            <Users size={24} />
                        </div>
                        <span style={{ fontSize: '0.875rem', color: 'var(--success)' }}>Active</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '700' }}>{stats?.totalUsers || 0}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Registered Users</div>
                </div>

                <div className="glass-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
                            <Activity size={24} />
                        </div>
                        <span style={{ fontSize: '0.875rem', color: 'var(--success)' }}>Live</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '700' }}>{stats?.activeSessions || 0}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Active JWT Sessions</div>
                </div>

                <div className="glass-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--error)' }}>
                            <ShieldAlert size={24} />
                        </div>
                        <span style={{ fontSize: '0.875rem', color: 'var(--error)' }}>24h</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '700' }}>{stats?.blockedAttempts || 0}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>High-Risk Blocks</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                {/* User Management */}
                <div className="glass-card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.25rem' }}>User Directory</h2>
                        <div className="input-group" style={{ maxWidth: '300px', margin: 0 }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    placeholder="Search users..."
                                    style={{ paddingLeft: '40px', background: 'rgba(15, 23, 42, 0.3)' }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                    <th style={{ padding: '16px' }}>User</th>
                                    <th style={{ padding: '16px' }}>MFA</th>
                                    <th style={{ padding: '16px' }}>Status</th>
                                    <th style={{ padding: '16px' }}>Last Risk</th>
                                    <th style={{ padding: '16px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid var(--border)', fontSize: '0.925rem' }}>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ fontWeight: '600' }}>{user.full_name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            {user.mfa_enabled ?
                                                <CheckCircle2 size={18} color="var(--success)" /> :
                                                <AlertCircle size={18} color="var(--warning)" />
                                            }
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                fontSize: '0.7rem',
                                                fontWeight: '800',
                                                background: user.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: user.is_active ? 'var(--success)' : 'var(--error)'
                                            }}>
                                                {user.is_active ? 'ACTIVE' : 'LOCKED'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ color: user.LoginAttempts?.[0]?.risk_score > 50 ? 'var(--error)' : 'var(--success)' }}>
                                                {user.LoginAttempts?.[0]?.risk_score || 0}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                <button
                                                    onClick={() => handleToggleStatus(user.id, user.is_active)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                                                >
                                                    {user.is_active ? <Lock size={18} /> : <Unlock size={18} />}
                                                </button>
                                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                                    <ExternalLink size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Alerts Feed */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-card" style={{ padding: '24px' }}>
                        <h3 style={{ marginBottom: '24px', fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <ShieldAlert size={20} color="var(--error)" /> Security Alerts
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {alerts.map((alert, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={alert.id}
                                    style={{
                                        padding: '16px',
                                        background: 'rgba(239, 68, 68, 0.05)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(239, 68, 68, 0.1)'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontWeight: '700', fontSize: '0.75rem', color: 'var(--error)' }}>
                                            {alert.action.replace('SECURITY_ALERT: ', '')}
                                        </span>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                            <Clock size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                            {new Date(alert.created_at).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.875rem' }}>
                                        {alert.TargetUser?.email || 'Unknown User'}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                                        {alert.details?.factors?.join(', ') || alert.details?.ip}
                                    </div>
                                </motion.div>
                            ))}
                            {alerts.length === 0 && (
                                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No recent threats detected</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
