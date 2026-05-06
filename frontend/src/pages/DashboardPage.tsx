import { useNavigate } from 'react-router-dom';
import { logout, logoutAll, getCurrentUser } from '../services/authService';
import { Shield, LogOut, User, LayoutDashboard, Settings, Bell, ShieldCheck, Activity, Globe } from 'lucide-react';
import DeviceList from '../components/DeviceList';

const DashboardPage: React.FC = () => {
    const user = getCurrentUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleLogoutAll = async () => {
        if (window.confirm('This will log you out from ALL devices. Continue?')) {
            await logoutAll();
            navigate('/login');
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ marginBottom: '16px', fontSize: '1.125rem' }}>Security Overview</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Risk Level</span>
                        <span style={{ color: 'var(--success)', fontWeight: '600' }}>Low</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>MFA Status</span>
                        <span style={{ color: user?.mfa_enabled ? 'var(--success)' : 'var(--warning)', fontWeight: '600' }}>
                            {user?.mfa_enabled ? 'Enabled' : 'Disabled'}
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Last Login</span>
                        <span>Just now</span>
                    </div>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '24px', gridColumn: 'span 2' }}>
                <h3 style={{ marginBottom: '24px', fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldCheck size={20} color="var(--primary)" /> Recognized Devices
                </h3>
                <DeviceList />
            </div>
        </div>
    );
};

export default DashboardPage;
