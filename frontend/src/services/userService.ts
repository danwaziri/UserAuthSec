import api from './apiService';

export const getLoginHistory = async () => {
    const response = await api.get('/auth/history');
    return response.data;
};

export const toggleMFA = async (enabled: boolean) => {
    const response = await api.post('/auth/toggle-mfa', { enabled });
    return response.data;
};
