import React from 'react';
import { getCurrentUser } from '../services/authService';
import { User, Mail, Shield, Calendar, BadgeCheck } from 'lucide-react';

const ProfilePage: React.FC = () => {
    const user = getCurrentUser();

    return (
        <div style={{ maxWidth: '800px' }}>
            <div className="glass-card" style={{ padding: '40px', display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
                <div style={{ 
                    width: '120px', 
                    height: '120px', 
                    borderRadius: '30px', 
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    fontWeight: '800',
                    color: 'white',
                    boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)'
                }}>
                    {user?.full_name?.[0] || 'U'}
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h2 style={{ fontSize: '2rem', margin: 0 }}>{user?.full_name}</h2>
                        {user?.role === 'admin' && (
                            <span style={{ 
                                padding: '4px 12px', 
                                background: 'rgba(99, 102, 241, 0.1)', 
                                color: 'var(--primary)', 
                                borderRadius: '20px', 
                                fontSize: '0.75rem', 
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <BadgeCheck size={14} /> VERIFIED ADMIN
                            </span>
                        )}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '32px' }}>
                        Security Protocol Level: {user?.role === 'admin' ? 'Elevated' : 'Standard'}
                    </p>

                    <div style={{ display: 'grid', gap: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ color: 'var(--primary)' }}><Mail size={20} /></div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</div>
                                <div style={{ fontSize: '1rem', fontWeight: '600' }}>{user?.email}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ color: 'var(--primary)' }}><Shield size={20} /></div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Account Role</div>
                                <div style={{ fontSize: '1rem', fontWeight: '600', textTransform: 'capitalize' }}>{user?.role}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ color: 'var(--primary)' }}><Calendar size={20} /></div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Member Since</div>
                                <div style={{ fontSize: '1rem', fontWeight: '600' }}>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '1px solid var(--border)' }}>
                        <button 
                            className="btn-primary" 
                            style={{ padding: '12px 32px' }}
                            onClick={() => alert('Profile editing coming soon!')}
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
