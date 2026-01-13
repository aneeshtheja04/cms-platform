import api from './axios';

export const assetsApi = {
    // Program Assets
    getProgramAssets: async (programId) => {
        const response = await api.get('/api/program-assets', { params: { program_id: programId } });
        return response.data;
    },

    createProgramAsset: async (data) => {
        const response = await api.post('/api/program-assets', data);
        return response.data;
    },

    deleteProgramAsset: async (id) => {
        const response = await api.delete(`/api/program-assets/${id}`);
        return response.data;
    },

    // Lesson Assets
    getLessonAssets: async (lessonId) => {
        const response = await api.get('/api/lesson-assets', { params: { lesson_id: lessonId } });
        return response.data;
    },

    createLessonAsset: async (data) => {
        const response = await api.post('/api/lesson-assets', data);
        return response.data;
    },

    deleteLessonAsset: async (id) => {
        const response = await api.delete(`/api/lesson-assets/${id}`);
        return response.data;
    },
};
