import api from './axios';

export const statsApi = {
  getStats: async () => {
    const [programs, lessons, users] = await Promise.all([
      api.get('/api/programs'),
      api.get('/api/lessons'),
      api.get('/api/users')
    ]);

    return {
      programsCount: programs.data.length,
      lessonsCount: lessons.data.length,
      usersCount: users.data.length
    };
  }
};
