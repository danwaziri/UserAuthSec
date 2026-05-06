import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';
import { Shield, User, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            const msg = 'Passwords do not match';
            setError(msg);
            toast.error(msg);
            setLoading(false);
            return;
        }

        try {
            const result = await register({
                full_name: formData.full_name,
                email: formData.email,
                password: formData.password
            });

            if (result.success) {
                toast.success('Registration successful!');
                setSuccess(true);
                setTimeout(() => navigate('/login'), 2000);
            } else {
                const msg = result.message || 'Registration failed';
                setError(msg);
                toast.error(msg);
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || 'An error occurred during registration';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-container fade-in">
                <div className="glass-card" style={{ textAlign: 'center' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.2)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <Shield size={32} color="var(--success)" />
                    </div>
                    <h2 style={{ marginBottom: '12px' }}>Registration Successful!</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Your account has been created. Redirecting to login...</p>
                    <Loader2 className="animate-spin" style={{ margin: '0 auto' }} />
                </div>
            </div>
        );
    }

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
                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1.875rem', marginBottom: '8px' }}>Create Account</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Join us to experience context-aware security</p>
                </div>

                {error && (
                    <div className="alert alert-error" style={{ marginBottom: '24px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="input-group">
                        <label htmlFor="full_name">Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User
                                size={20}
                                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                            />
                            <input
                                id="full_name"
                                type="text"
                                placeholder="John Doe"
                                value={formData.full_name}
                                onChange={handleChange}
                                style={{ paddingLeft: '46px' }}
                                required
                            />
                        </div>
                    </div>

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
                                value={formData.email}
                                onChange={handleChange}
                                style={{ paddingLeft: '46px' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock
                                size={20}
                                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                            />
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                style={{ paddingLeft: '46px' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock
                                size={20}
                                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                            />
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
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
                                Create Account <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
                        Sign In
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
