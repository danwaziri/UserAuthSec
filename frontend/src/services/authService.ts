import api from './apiService';

export const register = async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const login = async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
};

export const verifyMFA = async (mfaData: { userId: number; token: string; deviceId?: number }) => {
    const response = await api.post('/auth/verify-mfa', mfaData);
    if (response.data.success && response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
};

export const logout = async () => {
    try {
        await api.post('/auth/logout');
    } catch (e) {
        console.error('Logout error', e);
    } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export const logoutAll = async () => {
    try {
        await api.post('/auth/logout-all');
    } catch (e) {
        console.error('Logout all error', e);
    } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};
