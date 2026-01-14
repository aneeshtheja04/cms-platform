import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, BookOpen, Tag, Users } from 'lucide-react';
import logo from '../assets/logo-2150297_1280.png';

export default function DashboardLayout() {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/programs', label: 'Programs', icon: BookOpen },
    { path: '/topics', label: 'Topics', icon: Tag },
  ];

  // Add Users link for admin only
  if (hasRole('admin')) {
    navItems.push({ path: '/users', label: 'Users', icon: Users });
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-10">
        <div className="px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logo} alt="CMS Logo" className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-bold text-gray-900">CMS Platform</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.name} <span className="text-gray-400">({user?.role})</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors cursor-pointer font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 pt-14">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 fixed h-full">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="ml-64 bg-white border-t border-gray-200 py-4 px-8">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} CMS Platform. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
