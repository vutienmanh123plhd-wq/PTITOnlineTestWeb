import { Outlet, useNavigate } from 'react-router';
import { useApp } from '../../context/AppContext';
import { LogOut, User } from 'lucide-react';
import { useEffect } from 'react';

export function UserLayout() {
  const { user, setUser } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">Hệ thống thi trắc nghiệm</h1>
            <p className="text-sm text-gray-600 mt-1">Chào mừng, {user.username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
