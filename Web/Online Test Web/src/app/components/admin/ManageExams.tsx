import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../context/AppContext';
import { Plus, Edit, Trash2, Search, Clock, BookOpen } from 'lucide-react';

export function ManageExams() {
  const { exams, setExams } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredExams = exams.filter((exam) =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (examId: string) => {
    setExams(exams.filter((e) => e.id !== examId));
    setDeleteConfirm(null);
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      practice: 'Luyện tập',
      midterm: 'Giữa kỳ',
      final: 'Cuối kỳ',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      practice: 'bg-green-100 text-green-700',
      midterm: 'bg-yellow-100 text-yellow-700',
      final: 'bg-red-100 text-red-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Quản lý kỳ thi</h2>
          <p className="text-gray-600">Thêm, sửa, xóa các kỳ thi trong hệ thống</p>
        </div>
        <button
          onClick={() => navigate('/admin/dashboard/exams/create')}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          Tạo kỳ thi mới
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
            placeholder="Tìm kiếm kỳ thi..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Exams Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên kỳ thi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Câu hỏi
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{exam.title}</div>
                    <div className="text-sm text-gray-500">{exam.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(exam.type)}`}>
                      {getTypeLabel(exam.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {exam.duration} phút
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="w-4 h-4" />
                      {exam.questions.length} câu
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/admin/dashboard/exams/edit/${exam.id}`)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(exam.id)}
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

        {filteredExams.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy kỳ thi nào</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Xác nhận xóa</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa kỳ thi này? Hành động này không thể hoàn tác.
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
