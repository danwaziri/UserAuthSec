import api from './apiService';

export const getAdminStats = async () => {
    const response = await api.get('/admin/stats');
    return response.data;
};

export const getAdminUsers = async () => {
    const response = await api.get('/admin/users');
    return response.data;
};

export const getUserSecurityDetails = async (userId: number) => {
    const response = await api.get(`/admin/users/${userId}/security`);
    return response.data;
};

export const toggleUserStatus = async (userId: number, isActive: boolean) => {
    const response = await api.put(`/admin/users/${userId}/status`, { isActive });
    return response.data;
};
