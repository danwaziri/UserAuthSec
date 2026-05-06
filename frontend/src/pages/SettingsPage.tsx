import React, { useState } from 'react';
import { 
    Settings, 
    Bell, 
    Shield, 
    Moon, 
    Monitor, 
    Eye, 
    Smartphone,
    Globe,
    Lock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [notifications, setNotifications] = useState({
        email: true,
        browser: false,
        security: true
    });

    const [theme, setTheme] = useState('dark');

    const handleSave = () => {
        toast.success('Settings saved successfully');
    };

    const tabs = [
        { id: 'general', name: 'General', icon: Settings },
        { id: 'notifications', name: 'Notifications', icon: Bell },
        { id: 'privacy', name: 'Privacy', icon: Shield },
        { id: 'language', name: 'Language', icon: Globe }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        {/* Appearance Section */}
                        <div className="glass-card" style={{ padding: '32px' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Eye size={22} color="var(--primary)" /> Appearance
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '24px' }}>
                                Customize how the platform looks on your device.
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                {[
                                    { id: 'light', name: 'Light', icon: Monitor },
                                    { id: 'dark', name: 'Dark', icon: Moon },
                                    { id: 'system', name: 'System', icon: Settings }
                                ].map((item) => (
                                    <div 
                                        key={item.id}
                                        onClick={() => setTheme(item.id)}
                                        style={{ 
                                            padding: '20px', 
                                            borderRadius: '16px', 
                                            border: theme === item.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                                            background: theme === item.id ? 'rgba(99, 102, 241, 0.05)' : 'rgba(15, 23, 42, 0.3)',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <item.icon size={24} style={{ marginBottom: '12px', color: theme === item.id ? 'var(--primary)' : 'var(--text-muted)' }} />
                                        <div style={{ fontSize: '0.875rem', fontWeight: theme === item.id ? '600' : '400' }}>{item.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Session Security Section */}
                        <div className="glass-card" style={{ padding: '32px' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Lock size={22} color="var(--secondary)" /> Session Security
                            </h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>Automatic Logout</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Logout after 30 minutes of inactivity</div>
                                    </div>
                                    <div style={{ width: '48px', height: '24px', borderRadius: '12px', background: 'var(--primary)', position: 'relative' }}>
                                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white', position: 'absolute', top: '2px', right: '2px' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'notifications':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card" style={{ padding: '32px' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Bell size={22} color="var(--warning)" /> Notification Preferences
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {[
                                { id: 'email', label: 'Email Notifications', desc: 'Critical security alerts and account changes' },
                                { id: 'security', label: 'Security Alerts', desc: 'Notify me of high-risk login attempts' },
                                { id: 'browser', label: 'Browser Notifications', desc: 'Real-time push alerts in the browser' }
                            ].map((pref) => (
                                <div key={pref.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{pref.label}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{pref.desc}</div>
                                    </div>
                                    <button 
                                        onClick={() => setNotifications({...notifications, [pref.id]: !notifications[pref.id as keyof typeof notifications]})}
                                        style={{ 
                                            width: '48px', 
                                            height: '24px', 
                                            borderRadius: '12px', 
                                            background: notifications[pref.id as keyof typeof notifications] ? 'var(--primary)' : 'var(--text-muted)',
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
                                            left: notifications[pref.id as keyof typeof notifications] ? '26px' : '2px',
                                            transition: 'all 0.3s ease'
                                        }} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );
            case 'privacy':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card" style={{ padding: '32px' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Shield size={22} color="var(--success)" /> Data & Privacy
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.3)', border: '1px solid var(--border)' }}>
                                <div style={{ fontWeight: '600', marginBottom: '8px' }}>Download My Data</div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Get a copy of all your security logs and device history.</p>
                                <button style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--border)', color: 'white', fontSize: '0.875rem' }}>Export Data</button>
                            </div>
                            <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                <div style={{ fontWeight: '600', color: 'var(--error)', marginBottom: '8px' }}>Delete Account</div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Permanently remove your account and all associated security data.</p>
                                <button style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--error)', color: 'white', fontSize: '0.875rem' }}>Delete Permanently</button>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'language':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card" style={{ padding: '32px' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Globe size={22} color="var(--info)" /> Language & Region
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="input-group">
                                <label>Display Language</label>
                                <select style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border)', padding: '12px', borderRadius: '12px', color: 'white' }}>
                                    <option>English (US)</option>
                                    <option>English (UK)</option>
                                    <option>French</option>
                                    <option>Spanish</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Timezone</label>
                                <select style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border)', padding: '12px', borderRadius: '12px', color: 'white' }}>
                                    <option>(GMT+01:00) West Central Africa</option>
                                    <option>(GMT+00:00) UTC</option>
                                    <option>(GMT-05:00) Eastern Time</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '48px' }}>
                {/* Side Navigation */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {tabs.map((tab) => (
                        <div 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{ 
                                padding: '12px 16px', 
                                borderRadius: '12px', 
                                background: activeTab === tab.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent', 
                                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)', 
                                cursor: 'pointer', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '12px',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <tab.icon size={20} />
                            <span style={{ fontWeight: activeTab === tab.id ? '600' : '400' }}>{tab.name}</span>
                        </div>
                    ))}
                </div>

                {/* Content Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {renderContent()}
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
                        <button style={{ padding: '12px 24px', borderRadius: '12px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>Cancel</button>
                        <button onClick={handleSave} className="btn-primary" style={{ padding: '12px 32px' }}>Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Mail = ({ size, style }: { size: number, style?: any }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        style={style}
    >
        <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

export default SettingsPage;
