import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Edit, Trash2, Search, Mail, User as UserIcon } from 'lucide-react';

interface UserFormData {
  id?: string;
  username: string;
  email: string;
  role: 'user';
}

export function ManageUsers() {
  const { users, setUsers } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserFormData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    role: 'user',
  });
  const [formError, setFormError] = useState('');

  const students = users.filter(u => u.role === 'user');

  const filteredStudents = students.filter(student =>
    student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({ username: '', email: '', role: 'user' });
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEdit = (user: typeof users[0]) => {
    setEditingUser(user);
    setFormData({
      id: user.id,
      username: user.username,
      email: user.email,
      role: 'user',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.username || !formData.email) {
      setFormError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (!formData.email.includes('@')) {
      setFormError('Email không hợp lệ');
      return;
    }

    // Check username exists (except when editing same user)
    const existingUser = users.find(
      u => u.username === formData.username && u.id !== formData.id
    );
    if (existingUser) {
      setFormError('Tên đăng nhập đã tồn tại');
      return;
    }

    if (editingUser) {
      // Update existing user
      setUsers(users.map(u => 
        u.id === formData.id 
          ? { ...u, username: formData.username, email: formData.email }
          : u
      ));
    } else {
      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        username: formData.username,
        email: formData.email,
        role: 'user' as const,
      };
      setUsers([...users, newUser]);
    }

    setShowModal(false);
  };

  const handleDelete = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    setDeleteConfirm(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Quản lý người dùng</h2>
          <p className="text-gray-600">Thêm, sửa, xóa tài khoản sinh viên</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          Thêm sinh viên mới
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo tên, email hoặc mã số..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã số
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{student.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="font-medium text-gray-900">{student.username}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      {student.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(student)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(student.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy sinh viên nào</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingUser ? 'Chỉnh sửa sinh viên' : 'Thêm sinh viên mới'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên người dùng *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Nhập tên người dùng"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {formError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  {editingUser ? 'Lưu thay đổi' : 'Thêm sinh viên'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Xác nhận xóa</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa tài khoản sinh viên này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
