import api from './axios';

export const termsApi = {
    getAll: async (params = {}) => {
        const response = await api.get('/api/terms', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/api/terms/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/api/terms', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/api/terms/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/api/terms/${id}`);
        return response.data;
    },
};
