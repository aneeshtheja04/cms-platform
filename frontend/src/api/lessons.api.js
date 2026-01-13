import api from './axios';

export const lessonsApi = {
    getAll: async (params = {}) => {
        const response = await api.get('/api/lessons', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/api/lessons/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/api/lessons', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/api/lessons/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/api/lessons/${id}`);
        return response.data;
    },

    publish: async (id) => {
        const response = await api.post(`/api/lessons/${id}/publish`);
        return response.data;
    },

    schedule: async (id, data) => {
        const response = await api.post(`/api/lessons/${id}/schedule`, data);
        return response.data;
    },

    archive: async (id) => {
        const response = await api.post(`/api/lessons/${id}/archive`);
        return response.data;
    },
};
