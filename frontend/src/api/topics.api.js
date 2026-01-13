import api from './axios';

export const topicsApi = {
    getAll: async () => {
        const response = await api.get('/api/topics');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/api/topics/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/api/topics', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/api/topics/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/api/topics/${id}`);
        return response.data;
    },
};
