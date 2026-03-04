import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../context/AppContext';
import { Search, Clock, BookOpen, Calendar, ChevronRight } from 'lucide-react';

export function ExamList() {
  const { exams } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredExams = exams.filter((exam) => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || exam.type === filterType;
    const matchesStatus = filterStatus === 'all' || exam.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

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

  const getStatusLabel = (status: string) => {
    return status === 'free' ? 'Tự do' : 'Theo lịch';
  };

  const isExamAvailable = (exam: any) => {
    if (exam.status === 'free') return true;
    
    if (exam.startTime && exam.endTime) {
      const now = new Date();
      const start = new Date(exam.startTime);
      const end = new Date(exam.endTime);
      return now >= start && now <= end;
    }
    
    return true;
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Danh sách kỳ thi</h2>
        <p className="text-gray-600">Chọn kỳ thi để bắt đầu làm bài</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên kỳ thi..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại kỳ thi
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Tất cả</option>
              <option value="practice">Luyện tập</option>
              <option value="midterm">Giữa kỳ</option>
              <option value="final">Cuối kỳ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Tất cả</option>
              <option value="free">Tự do</option>
              <option value="scheduled">Theo lịch</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exam Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => {
          const available = isExamAvailable(exam);
          return (
            <div
              key={exam.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(exam.type)}`}>
                      {getTypeLabel(exam.type)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {getStatusLabel(exam.status)}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {exam.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {exam.description}
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Thời gian: {exam.duration} phút</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span>{exam.questions.length} câu hỏi</span>
                  </div>
                  {exam.startTime && exam.endTime && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(exam.startTime).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {available ? (
                  <button
                    onClick={() => navigate(`/user/exam/${exam.id}`)}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                  >
                    Bắt đầu làm bài
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-2 rounded-lg cursor-not-allowed"
                  >
                    Chưa đến thời gian
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredExams.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Không tìm thấy kỳ thi nào</p>
        </div>
      )}
    </div>
  );
}
