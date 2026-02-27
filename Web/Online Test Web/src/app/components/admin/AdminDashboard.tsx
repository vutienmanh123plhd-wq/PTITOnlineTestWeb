import { useApp } from '../../context/AppContext';
import { FileText, Users, TrendingUp, Award, Clock, CheckCircle } from 'lucide-react';

export function AdminDashboard() {
  const { exams, users, attempts } = useApp();

  const totalExams = exams.length;
  const totalUsers = users.filter((u) => u.role === 'user').length;
  const totalAttempts = attempts.length;
  const averageScore = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
    : 0;

  const recentAttempts = [...attempts]
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 5);

  const getExamTitle = (examId: string) => {
    const exam = exams.find((e) => e.id === examId);
    return exam?.title || 'Không xác định';
  };

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user?.username || 'Không xác định';
  };

  const stats = [
    {
      label: 'Tổng số kỳ thi',
      value: totalExams,
      icon: FileText,
      color: 'bg-blue-100 text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Người dùng',
      value: totalUsers,
      icon: Users,
      color: 'bg-green-100 text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Lượt thi',
      value: totalAttempts,
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Điểm trung bình',
      value: `${averageScore}`,
      icon: Award,
      color: 'bg-yellow-100 text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Tổng quan về hệ thống thi trắc nghiệm</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`${stat.bgColor} rounded-lg p-6 border border-gray-200`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Hoạt động gần đây</h3>
          <div className="space-y-4">
            {recentAttempts.length > 0 ? (
              recentAttempts.map((attempt) => (
                <div key={attempt.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    attempt.score >= 80 ? 'bg-green-100 text-green-600' : 
                    attempt.score >= 50 ? 'bg-yellow-100 text-yellow-600' : 
                    'bg-red-100 text-red-600'
                  }`}>
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{getUserName(attempt.userId)}</div>
                    <div className="text-sm text-gray-600">{getExamTitle(attempt.examId)}</div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>Điểm: {attempt.score}</span>
                      <span>•</span>
                      <span>{new Date(attempt.completedAt).toLocaleString('vi-VN')}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">Chưa có hoạt động nào</p>
            )}
          </div>
        </div>

        {/* Exam Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Trạng thái kỳ thi</h3>
          <div className="space-y-4">
            {exams.slice(0, 5).map((exam) => {
              const examAttempts = attempts.filter((a) => a.examId === exam.id);
              const avgScore = examAttempts.length > 0
                ? Math.round(examAttempts.reduce((sum, a) => sum + a.score, 0) / examAttempts.length)
                : 0;

              return (
                <div key={exam.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">{exam.title}</div>
                    <span className="text-sm text-gray-600">{examAttempts.length} lượt thi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          avgScore >= 80 ? 'bg-green-500' :
                          avgScore >= 50 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${avgScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{avgScore}%</span>
                  </div>
                </div>
              );
            })}
            {exams.length === 0 && (
              <p className="text-gray-500 text-center py-8">Chưa có kỳ thi nào</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
