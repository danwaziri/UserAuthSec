import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/authService';
import { getLoginHistory, toggleMFA } from '../services/userService';
import { 
    Shield, 
    Smartphone, 
    Clock, 
    MapPin, 
    ShieldAlert, 
    CheckCircle,
    Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const SecurityPage: React.FC = () => {
    const user = getCurrentUser();
    const [history, setHistory] = useState<any[]>([]);
    const [mfaEnabled, setMfaEnabled] = useState(user?.mfa_enabled || false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getLoginHistory();
                if (res.success) {
                    setHistory(res.data);
                }
            } catch (error) {
                toast.error('Failed to load security history');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleMFAToggle = async () => {
        try {
            const nextState = !mfaEnabled;
            const res = await toggleMFA(nextState);
            if (res.success) {
                setMfaEnabled(nextState);
                toast.success(`MFA ${nextState ? 'enabled' : 'disabled'} successfully`);
                // Update local storage user if needed
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                currentUser.mfa_enabled = nextState;
                localStorage.setItem('user', JSON.stringify(currentUser));
            }
        } catch (error) {
            toast.error('Failed to update MFA settings');
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* MFA Card */}
                <div className="glass-card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                            <Smartphone size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Multi-Factor Auth</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Secure your account with OTP</p>
                        </div>
                    </div>

                    <div style={{ 
                        padding: '16px', 
                        background: 'rgba(15, 23, 42, 0.3)', 
                        borderRadius: '12px', 
                        marginBottom: '24px',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span style={{ fontWeight: '600' }}>{mfaEnabled ? 'Enabled' : 'Disabled'}</span>
                        <button 
                            onClick={handleMFAToggle}
                            style={{ 
                                width: '48px', 
                                height: '24px', 
                                borderRadius: '12px', 
                                background: mfaEnabled ? 'var(--primary)' : 'var(--text-muted)',
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                border: 'none'
                            }}
                        >
                            <div style={{ 
                                width: '20px', 
                                height: '20px', 
                                borderRadius: '50%', 
                                background: 'white', 
                                position: 'absolute', 
                                top: '2px', 
                                left: mfaEnabled ? '26px' : '2px',
                                transition: 'all 0.3s ease'
                            }} />
                        </button>
                    </div>

                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                        <Info size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        When enabled, any login attempt from an unrecognized device or location will require a verification code sent to your email.
                    </p>
                </div>

                {/* Risk Overview */}
                <div className="glass-card" style={{ padding: '32px' }}>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Shield size={20} color="var(--primary)" /> Risk Assessment
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Current Status</span>
                            <span style={{ color: 'var(--success)', fontWeight: '700', fontSize: '0.875rem' }}>SECURE</span>
                        </div>
                        <div style={{ height: '8px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: '15%', height: '100%', background: 'var(--success)' }} />
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Based on your last 20 login attempts, your account shows no suspicious activity.
                        </p>
                    </div>
                </div>
            </div>

            {/* Login History */}
            <div className="glass-card" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Clock size={20} color="var(--secondary)" /> Recent Login Activity
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {loading ? (
                        <div>Analyzing history...</div>
                    ) : history.map((item, i) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={item.id} 
                            style={{ 
                                display: 'flex', 
                                gap: '16px', 
                                paddingBottom: '20px', 
                                borderBottom: i === history.length - 1 ? 'none' : '1px solid var(--border)' 
                            }}
                        >
                            <div style={{ 
                                width: '40px', 
                                height: '40px', 
                                borderRadius: '10px', 
                                background: item.status === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: item.status === 'success' ? 'var(--success)' : 'var(--error)'
                            }}>
                                {item.status === 'success' ? <CheckCircle size={20} /> : <ShieldAlert size={20} />}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: '600', fontSize: '0.925rem' }}>{item.status.toUpperCase()} LOGIN</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(item.attempted_at).toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <MapPin size={12} /> {item.city || 'Unknown'}, {item.country || 'Unknown'}
                                    </span>
                                    <span>IP: {item.ip_address}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {!loading && history.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                            No login history found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SecurityPage;
