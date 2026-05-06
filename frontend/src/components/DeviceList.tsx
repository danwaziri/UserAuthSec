import React, { useEffect, useState } from 'react';
import { getDevices, toggleDeviceTrust, deleteDevice } from '../services/deviceService';
import { Laptop, Smartphone, Monitor, Shield, Trash2, Clock, Globe } from 'lucide-react';

interface Device {
    id: number;
    device_name: string;
    browser: string;
    os: string;
    is_trusted: boolean;
    last_used_at: string;
}

const DeviceList: React.FC = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDevices = async () => {
        try {
            const result = await getDevices();
            if (result.success) {
                setDevices(result.data);
            }
        } catch (error) {
            console.error('Error fetching devices:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevices();
    }, []);

    const handleToggleTrust = async (deviceId: number, currentTrust: boolean) => {
        try {
            await toggleDeviceTrust(deviceId, !currentTrust);
            fetchDevices();
        } catch (error) {
            console.error('Error toggling trust:', error);
        }
    };

    const handleDelete = async (deviceId: number) => {
        if (window.confirm('Are you sure you want to remove this device?')) {
            try {
                await deleteDevice(deviceId);
                fetchDevices();
            } catch (error) {
                console.error('Error deleting device:', error);
            }
        }
    };

    const getDeviceIcon = (os: string) => {
        const lowerOs = os?.toLowerCase() || '';
        if (lowerOs.includes('android') || lowerOs.includes('ios')) return <Smartphone size={20} />;
        if (lowerOs.includes('windows') || lowerOs.includes('macos')) return <Laptop size={20} />;
        return <Monitor size={20} />;
    };

    if (loading) return <div>Loading devices...</div>;

    return (
        <div className="device-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {devices.map((device) => (
                <div
                    key={device.id}
                    className="glass-card"
                    style={{
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '20px'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'rgba(99, 102, 241, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--primary)'
                        }}>
                            {getDeviceIcon(device.os)}
                        </div>
                        <div>
                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                {device.device_name}
                                {device.is_trusted && (
                                    <span style={{
                                        marginLeft: '8px',
                                        fontSize: '0.65rem',
                                        background: 'rgba(16, 185, 129, 0.2)',
                                        color: 'var(--success)',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        verticalAlign: 'middle'
                                    }}>
                                        TRUSTED
                                    </span>
                                )}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '12px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Clock size={12} /> {new Date(device.last_used_at).toLocaleDateString()}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Globe size={12} /> {device.browser}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => handleToggleTrust(device.id, device.is_trusted)}
                            style={{
                                padding: '8px',
                                borderRadius: '10px',
                                background: device.is_trusted ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                color: device.is_trusted ? 'var(--error)' : 'var(--success)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '0.75rem'
                            }}
                        >
                            <Shield size={16} />
                            {device.is_trusted ? 'Untrust' : 'Trust'}
                        </button>
                        <button
                            onClick={() => handleDelete(device.id)}
                            style={{
                                padding: '8px',
                                borderRadius: '10px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DeviceList;
