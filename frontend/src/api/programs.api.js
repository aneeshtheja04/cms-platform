import api from './axios';

export const programsApi = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/programs', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/programs/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/api/programs', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/api/programs/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/programs/${id}`);
    return response.data;
  },
};
