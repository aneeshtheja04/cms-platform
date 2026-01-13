import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    { label: 'Programs', value: '12', color: 'bg-blue-500' },
    { label: 'Lessons', value: '84', color: 'bg-green-500' },
    { label: 'Users', value: '3', color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Welcome back, {user?.name}!
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center">
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl font-bold mr-4`}>
                {stat.value}
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
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
