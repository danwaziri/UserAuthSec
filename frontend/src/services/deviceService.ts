import api from './apiService';

export const getDevices = async () => {
    const response = await api.get('/devices');
    return response.data;
};

export const toggleDeviceTrust = async (deviceId: number, isTrusted: boolean) => {
    const response = await api.put(`/devices/${deviceId}/trust`, { isTrusted });
    return response.data;
};

export const deleteDevice = async (deviceId: number) => {
    const response = await api.delete(`/devices/${deviceId}`);
    return response.data;
};
