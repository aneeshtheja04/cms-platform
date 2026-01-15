import api from './axios';

export const statsApi = {
  getStats: async (isAdmin = false) => {
    const results = { programsCount: 0, lessonsCount: 0, usersCount: 0 };

    // Always fetch programs and lessons (accessible to all authenticated users)
    try {
      const [programs, lessons] = await Promise.all([
        api.get('/api/programs'),
        api.get('/api/lessons')
      ]);
      results.programsCount = programs.data.length;
      results.lessonsCount = lessons.data.length;
    } catch (err) {
      console.error('Failed to fetch programs/lessons stats:', err);
    }

    // Only fetch users for admin (this endpoint is admin-only)
    if (isAdmin) {
      try {
        const users = await api.get('/api/users');
        results.usersCount = users.data.length;
      } catch (err) {
        console.error('Failed to fetch users stats:', err);
      }
    }

    return results;
  }
};
