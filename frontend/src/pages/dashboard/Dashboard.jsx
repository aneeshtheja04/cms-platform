import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card, { StatCard } from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import { statsApi } from '../../api/stats.api';
import { BookOpen, Layers, Users } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await statsApi.getStats();
      setStats({
        programs: data.programsCount,
        lessons: data.lessonsCount,
        users: data.usersCount,
      });
    } catch (err) {
      setError('Failed to load statistics');
      console.error('Error fetching stats:', err);
      // Set default values on error
      setStats({
        programs: 0,
        lessons: 0,
        users: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your content today.</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats && (
          <>
            <StatCard
              label="Programs"
              value={stats.programs}
              color="green"
              icon={<Layers className="w-6 h-6" />}
            />

            <StatCard
              label="Lessons"
              value={stats.lessons}
              color="blue"
              icon={<BookOpen className="w-6 h-6" />}
            />

            <StatCard
              label="Users"
              value={stats.users}
              color="orange"
              icon={<Users className="w-6 h-6" />}
            />
          </>
        )}
      </div>

      {/* Recent Activity */}
      <Card title="Recent Activity">
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Intro to Algebra</p>
              <p className="text-sm text-gray-600">Published 10 minutes ago</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              Published
            </span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Python Basics</p>
              <p className="text-sm text-gray-600">Published 2 hours ago</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              Published
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">Hindi Grammar</p>
              <p className="text-sm text-gray-600">Scheduled for tomorrow</p>
            </div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
              Scheduled
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
