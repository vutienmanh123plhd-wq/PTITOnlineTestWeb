import { useParams, useNavigate } from 'react-router';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, XCircle, Clock, Award, Home, RotateCcw, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function ExamResult() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { attempts, exams } = useApp();

  const attempt = attempts.find((a) => a.id === attemptId);
  const exam = attempt ? exams.find((e) => e.id === attempt.examId) : null;

  if (!attempt || !exam) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không tìm thấy kết quả</p>
      </div>
    );
  }

  const correctCount = exam.questions.filter(
    (q) => attempt.answers[q.id] === q.correctAnswer
  ).length;
  const totalQuestions = exam.questions.length;
  const wrongCount = totalQuestions - correctCount;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 50) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  // Prepare chart data
  const pieData = [
    { name: 'Đúng', value: correctCount, color: '#10b981' },
    { name: 'Sai', value: wrongCount, color: '#ef4444' },
  ];

  const barData = [
    {
      name: 'Kết quả',
      'Câu đúng': correctCount,
      'Câu sai': wrongCount,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
            attempt.score >= 80 ? 'bg-green-100' : attempt.score >= 50 ? 'bg-yellow-100' : 'bg-red-100'
          }`}>
            <Award className={`w-12 h-12 ${getScoreColor(attempt.score)}`} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Kết quả bài thi</h2>
          <p className="text-gray-600">{exam.title}</p>
        </div>

        <div className={`border-2 rounded-xl p-8 mb-6 ${getScoreBgColor(attempt.score)}`}>
          <div className="text-center">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(attempt.score)}`}>
              {attempt.score}
            </div>
            <div className="text-lg text-gray-600">Điểm số</div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{totalQuestions}</div>
            <div className="text-sm text-gray-600 mt-1">Tổng số câu</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">{correctCount}</div>
            <div className="text-sm text-gray-600 mt-1">Câu đúng</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-3xl font-bold text-red-600">{wrongCount}</div>
            <div className="text-sm text-gray-600 mt-1">Câu sai</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">{attempt.timeSpent}</div>
            <div className="text-sm text-gray-600 mt-1">Phút làm bài</div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => navigate('/user')}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </button>
          <button
            onClick={() => navigate(`/user/exam/${exam.id}`)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Làm lại
          </button>
        </div>
      </div>

      {/* Statistics Charts */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-bold text-gray-900">Thống kê chi tiết</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div>
            <h4 className="text-center font-medium text-gray-700 mb-4">Tỷ lệ đúng/sai</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div>
            <h4 className="text-center font-medium text-gray-700 mb-4">Phân tích kết quả</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Câu đúng" fill="#10b981" />
                <Bar dataKey="Câu sai" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="text-sm text-blue-700 mb-1">Tỷ lệ chính xác</div>
            <div className="text-2xl font-bold text-blue-900">
              {((correctCount / totalQuestions) * 100).toFixed(1)}%
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="text-sm text-purple-700 mb-1">Tốc độ làm bài</div>
            <div className="text-2xl font-bold text-purple-900">
              {(attempt.timeSpent / totalQuestions).toFixed(1)} phút/câu
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <div className="text-sm text-green-700 mb-1">Xếp loại</div>
            <div className="text-2xl font-bold text-green-900">
              {attempt.score >= 80 ? 'Giỏi' : attempt.score >= 65 ? 'Khá' : attempt.score >= 50 ? 'Trung bình' : 'Yếu'}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Review */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Xem lại câu trả lời</h3>
        <div className="space-y-6">
          {exam.questions.map((question, index) => {
            const userAnswer = attempt.answers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;
            const wasAnswered = userAnswer !== undefined;

            return (
              <div
                key={question.id}
                className={`border-2 rounded-lg p-6 ${
                  isCorrect
                    ? 'border-green-200 bg-green-50'
                    : wasAnswered
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    isCorrect
                      ? 'bg-green-200 text-green-700'
                      : 'bg-red-200 text-red-700'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className={`font-medium ${
                        isCorrect ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {isCorrect ? 'Đúng' : wasAnswered ? 'Sai' : 'Chưa trả lời'}
                      </span>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      {question.question}
                    </h4>

                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const isUserAnswer = userAnswer === optionIndex;
                        const isCorrectAnswer = question.correctAnswer === optionIndex;

                        return (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-lg border-2 ${
                              isCorrectAnswer
                                ? 'border-green-500 bg-green-100'
                                : isUserAnswer
                                ? 'border-red-500 bg-red-100'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isCorrectAnswer && (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              )}
                              {isUserAnswer && !isCorrectAnswer && (
                                <XCircle className="w-4 h-4 text-red-600" />
                              )}
                              <span className={`${
                                isCorrectAnswer
                                  ? 'font-medium text-green-900'
                                  : isUserAnswer
                                  ? 'font-medium text-red-900'
                                  : 'text-gray-700'
                              }`}>
                                {option}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {question.explanation && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex gap-2">
                          <div className="font-medium text-blue-900">Giải thích:</div>
                          <div className="text-blue-800">{question.explanation}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}