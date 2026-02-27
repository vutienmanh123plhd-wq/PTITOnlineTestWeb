import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useApp } from '../../context/AppContext';
import { Shield, User, Lock } from 'lucide-react';

export function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser, users } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    // Demo: allow any admin login or use mock admin
    const foundAdmin = users.find(
      (u) => u.username === username && u.role === 'admin'
    );

    if (foundAdmin || username === 'admin') {
      setUser(
        foundAdmin || {
          id: 'admin',
          username: username,
          email: 'admin@example.com',
          role: 'admin',
        }
      );
      navigate('/admin/dashboard');
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Quản trị viên</h2>
            <p className="text-gray-600 mt-2">Đăng nhập vào bảng điều khiển quản trị</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên đăng nhập
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Nhập tên đăng nhập"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Nhập mật khẩu"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-medium"
            >
              Đăng nhập
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Demo: Nhập "admin" và bất kỳ mật khẩu để trải nghiệm
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-sm text-purple-600 hover:text-purple-700"
          >
            ← Quay lại trang đăng nhập sinh viên
          </Link>
        </div>
      </div>
    </div>
  );
}
