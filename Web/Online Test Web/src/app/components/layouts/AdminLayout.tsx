import { Outlet, useNavigate, useLocation, Link } from 'react-router';
import { useApp } from '../../context/AppContext';
import { LogOut, LayoutDashboard, FileText, BarChart3, Users, UserCog } from 'lucide-react';
import { useEffect } from 'react';

export function AdminLayout() {
  const { user, setUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    setUser(null);
    navigate('/admin');
  };

  if (!user) return null;

  const navItems = [
    { path: '/admin/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { path: '/admin/dashboard/exams', label: 'Quản lý kỳ thi', icon: FileText },
    { path: '/admin/dashboard/users', label: 'Quản lý người dùng', icon: UserCog },
    { path: '/admin/dashboard/statistics', label: 'Thống kê', icon: BarChart3 },
    { path: '/admin/dashboard/students', label: 'Kết quả sinh viên', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Quản trị hệ thống thi</h1>
            <p className="text-sm text-indigo-200 mt-1">Quản trị viên: {user.username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="bg-white rounded-lg shadow-sm mb-6 p-2">
          <div className="flex gap-2 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
        
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}