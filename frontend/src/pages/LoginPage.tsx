import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import { Shield, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getDeviceFingerprint } from '../utils/fingerprint';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const fingerprint = await getDeviceFingerprint();
            const result = await login({ email, password, fingerprint });

            if (result.success) {
                toast.success('Authentication successful');
                if (result.mfaRequired) {
                    toast.info('Verification required: Check your email');
                    // Store partial data for MFA step
                    localStorage.setItem('mfa_user_id', result.data.userId);
                    localStorage.setItem('mfa_email', result.data.email);
                    if (result.data.deviceId) {
                        localStorage.setItem('mfa_device_id', result.data.deviceId);
                    }
                    navigate('/verify-mfa', { state: { factors: result.factors } });
                } else {
                    navigate('/dashboard');
                }
            } else {
                const msg = result.message || 'Login failed';
                setError(msg);
                toast.error(msg);
                if (result.riskLevel === 'HIGH') {
                    toast.warning(`Security Block: ${result.message}`, {
                        description: `Factors: ${result.factors?.join(', ')}`
                    });
                }
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || 'An error occurred during login';
            setError(msg);
            toast.error(msg);
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
            >
                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1.875rem', marginBottom: '8px' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Enter your credentials to access your account</p>
                </div>

                {error && (
                    <div className="alert alert-error" style={{ marginBottom: '24px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail
                                size={20}
                                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                            />
                            <input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ paddingLeft: '46px' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label htmlFor="password">Password</label>
                            <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none' }}>
                                Forgot Password?
                            </Link>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock
                                size={20}
                                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                            />
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ paddingLeft: '46px' }}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '12px' }}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                Sign In <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
                        Create Account
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
