import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Download, ChevronDown, ChevronUp, Eye, Award } from 'lucide-react';

export function StudentResults() {
  const { users, attempts, exams } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  const students = users.filter(u => u.role === 'user');

  const filteredStudents = students.filter(student =>
    student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStudentAttempts = (studentId: string) => {
    return attempts.filter(a => a.userId === studentId);
  };

  const getExamTitle = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    return exam?.title || 'Không xác định';
  };

  const getStudentStats = (studentId: string) => {
    const studentAttempts = getStudentAttempts(studentId);
    const totalAttempts = studentAttempts.length;
    const avgScore = totalAttempts > 0
      ? Math.round(studentAttempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts)
      : 0;
    const completed = studentAttempts.length;
    const passed = studentAttempts.filter(a => a.score >= 50).length;

    return { totalAttempts, avgScore, completed, passed };
  };

  const toggleExpand = (studentId: string) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  const handleExportStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    alert(`Xuất báo cáo cho sinh viên: ${student.username}`);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Kết quả sinh viên</h2>
        <p className="text-gray-600">Xem chi tiết kết quả thi của từng sinh viên</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên, email hoặc mã sinh viên..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Students List */}
      <div className="space-y-4">
        {filteredStudents.map(student => {
          const stats = getStudentStats(student.id);
          const studentAttempts = getStudentAttempts(student.id);
          const isExpanded = expandedStudent === student.id;

          return (
            <div key={student.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Student Header */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-indigo-600">
                        {student.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{student.username}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>{student.email}</span>
                        <span>•</span>
                        <span>ID: {student.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mr-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{stats.totalAttempts}</div>
                      <div className="text-xs text-gray-600">Lượt thi</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">{stats.avgScore}</div>
                      <div className="text-xs text-gray-600">Điểm TB</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.passed}/{stats.completed}</div>
                      <div className="text-xs text-gray-600">Đạt/Tổng</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExportStudent(student.id)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                      title="Xuất báo cáo"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => toggleExpand(student.id)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-gray-200 bg-gray-50 p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Chi tiết các kỳ thi</h4>
                  
                  {studentAttempts.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Sinh viên chưa tham gia kỳ thi nào
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {studentAttempts
                        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                        .map(attempt => {
                          const exam = exams.find(e => e.id === attempt.examId);
                          const isPassed = attempt.score >= 50;

                          return (
                            <div key={attempt.id} className="bg-white rounded-lg p-4 border border-gray-200">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 mb-1">
                                    {getExamTitle(attempt.examId)}
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span>
                                      {new Date(attempt.completedAt).toLocaleDateString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </span>
                                    <span>•</span>
                                    <span>Thời gian: {attempt.timeSpent} phút</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4">
                                  <div className={`px-4 py-2 rounded-lg ${
                                    isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                    <div className="text-2xl font-bold">{attempt.score}</div>
                                    <div className="text-xs">{isPassed ? 'Đạt' : 'Không đạt'}</div>
                                  </div>

                                  {exam && (
                                    <div className="text-sm text-gray-600">
                                      <div>
                                        {Object.keys(attempt.answers).length} / {exam.questions.length}
                                      </div>
                                      <div className="text-xs">câu trả lời</div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Answer details */}
                              {exam && (
                                <details className="mt-4">
                                  <summary className="cursor-pointer text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-2">
                                    <Eye className="w-4 h-4" />
                                    Xem chi tiết câu trả lời
                                  </summary>
                                  <div className="mt-4 space-y-3">
                                    {exam.questions.map((question, qIndex) => {
                                      const userAnswer = attempt.answers[question.id];
                                      const isCorrect = userAnswer === question.correctAnswer;
                                      const wasAnswered = userAnswer !== undefined;

                                      return (
                                        <div
                                          key={question.id}
                                          className={`p-3 rounded border ${
                                            isCorrect
                                              ? 'border-green-200 bg-green-50'
                                              : wasAnswered
                                              ? 'border-red-200 bg-red-50'
                                              : 'border-gray-200 bg-gray-50'
                                          }`}
                                        >
                                          <div className="flex items-start gap-2">
                                            <span className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-medium">
                                              {qIndex + 1}
                                            </span>
                                            <div className="flex-1">
                                              <div className="text-sm font-medium text-gray-900 mb-1">
                                                {question.question}
                                              </div>
                                              <div className="text-xs text-gray-600">
                                                {wasAnswered ? (
                                                  <>
                                                    Trả lời: {question.options[userAnswer]} 
                                                    {!isCorrect && ` (Đúng: ${question.options[question.correctAnswer]})`}
                                                  </>
                                                ) : (
                                                  <>Chưa trả lời (Đúng: {question.options[question.correctAnswer]})</>
                                                )}
                                              </div>
                                            </div>
                                            <Award className={`w-5 h-5 ${
                                              isCorrect ? 'text-green-600' : 'text-red-600'
                                            }`} />
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </details>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Không tìm thấy sinh viên nào</p>
        </div>
      )}
    </div>
  );
}
