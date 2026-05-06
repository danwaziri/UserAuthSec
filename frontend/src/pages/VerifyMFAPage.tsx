import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Smartphone, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { verifyMFA } from '../services/authService';

const VerifyMFAPage: React.FC = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState<number | null>(null);
    const [deviceId, setDeviceId] = useState<number | null>(null);

    const navigate = useNavigate();
    const location = useLocation();
    const factors = location.state?.factors || [];

    useEffect(() => {
        const storedEmail = localStorage.getItem('mfa_email');
        const storedUserId = localStorage.getItem('mfa_user_id');
        const storedDeviceId = localStorage.getItem('mfa_device_id');

        if (!storedEmail || !storedUserId) {
            navigate('/login');
        } else {
            setEmail(storedEmail);
            setUserId(parseInt(storedUserId));
            if (storedDeviceId) setDeviceId(parseInt(storedDeviceId));
        }
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        setLoading(true);
        setError('');

        try {
            const result = await verifyMFA({
                userId,
                token: otp,
                deviceId: deviceId || undefined
            });

            if (result.success) {
                // Cleanup
                localStorage.removeItem('mfa_user_id');
                localStorage.removeItem('mfa_email');
                localStorage.removeItem('mfa_device_id');
                navigate('/dashboard');
            } else {
                setError(result.message || 'Verification failed');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container fade-in">
            <div className="logo">
                <Shield size={32} color="#6366f1" />
                <span className="logo-text">UAAuthSec</span>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card"
            >
                <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'rgba(99, 102, 241, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        color: 'var(--primary)'
                    }}>
                        <Smartphone size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Two-Step Verification</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        We noticed something unusual about this login. We've sent a code to <br />
                        <strong style={{ color: 'var(--text-main)', opacity: 0.9 }}>{email}</strong>
                    </p>
                </div>

                {factors.length > 0 && (
                    <div style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        borderRadius: '12px',
                        padding: '12px',
                        marginBottom: '24px',
                        display: 'flex',
                        gap: '12px'
                    }}>
                        <AlertTriangle size={20} color="#f59e0b" style={{ flexShrink: 0 }} />
                        <div style={{ fontSize: '0.75rem', color: '#f59e0b' }}>
                            <strong>Security context:</strong> {factors.join(', ')}
                        </div>
                    </div>
                )}

                {error && (
                    <div className="alert alert-error" style={{ marginBottom: '24px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="input-group">
                        <label htmlFor="otp" style={{ textAlign: 'center' }}>Enter 6-digit code</label>
                        <input
                            id="otp"
                            type="text"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            style={{
                                textAlign: 'center',
                                fontSize: '1.5rem',
                                letterSpacing: '0.5em',
                                fontWeight: '700'
                            }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading || otp.length < 6}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '12px' }}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                Verify Identity <ArrowRight size={20} />
                            </>
                        )}
                    </button>

                    <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
                        Didn't receive a code?{' '}
                        <button type="button" style={{ background: 'none', color: 'var(--primary)', fontWeight: '600', padding: 0, border: 'none', cursor: 'pointer' }}>
                            Resend
                        </button>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default VerifyMFAPage;
