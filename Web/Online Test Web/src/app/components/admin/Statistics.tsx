import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, Filter, TrendingUp, Users, Award } from 'lucide-react';

export function Statistics() {
  const { exams, attempts, users } = useApp();
  const [selectedExam, setSelectedExam] = useState<string>('all');

  const filteredAttempts = selectedExam === 'all' 
    ? attempts 
    : attempts.filter(a => a.examId === selectedExam);

  // Calculate statistics
  const totalAttempts = filteredAttempts.length;
  const averageScore = totalAttempts > 0
    ? Math.round(filteredAttempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts)
    : 0;
  
  const completionRate = totalAttempts > 0 ? 100 : 0;

  // Score distribution
  const scoreRanges = [
    { range: '0-20', count: 0 },
    { range: '21-40', count: 0 },
    { range: '41-60', count: 0 },
    { range: '61-80', count: 0 },
    { range: '81-100', count: 0 },
  ];

  filteredAttempts.forEach(attempt => {
    if (attempt.score <= 20) scoreRanges[0].count++;
    else if (attempt.score <= 40) scoreRanges[1].count++;
    else if (attempt.score <= 60) scoreRanges[2].count++;
    else if (attempt.score <= 80) scoreRanges[3].count++;
    else scoreRanges[4].count++;
  });

  // Exam participation
  const examStats = exams.map(exam => {
    const examAttempts = attempts.filter(a => a.examId === exam.id);
    const avgScore = examAttempts.length > 0
      ? Math.round(examAttempts.reduce((sum, a) => sum + a.score, 0) / examAttempts.length)
      : 0;
    
    return {
      name: exam.title.length > 20 ? exam.title.substring(0, 20) + '...' : exam.title,
      'Lượt thi': examAttempts.length,
      'Điểm TB': avgScore,
    };
  });

  // Pass rate by exam type
  const typeStats = [
    { name: 'Luyện tập', passed: 0, failed: 0 },
    { name: 'Giữa kỳ', passed: 0, failed: 0 },
    { name: 'Cuối kỳ', passed: 0, failed: 0 },
  ];

  filteredAttempts.forEach(attempt => {
    const exam = exams.find(e => e.id === attempt.examId);
    if (!exam) return;
    
    const typeMap: Record<string, number> = {
      practice: 0,
      midterm: 1,
      final: 2,
    };
    
    const index = typeMap[exam.type];
    if (index !== undefined) {
      if (attempt.score >= 50) {
        typeStats[index].passed++;
      } else {
        typeStats[index].failed++;
      }
    }
  });

  const pieData = typeStats.map(stat => ({
    name: stat.name,
    value: stat.passed + stat.failed,
  })).filter(d => d.value > 0);

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  const handleExportPDF = () => {
    alert('Tính năng xuất PDF đang được phát triển');
  };

  const handleExportExcel = () => {
    alert('Tính năng xuất Excel đang được phát triển');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Thống kê</h2>
          <p className="text-gray-600">Phân tích kết quả và xu hướng học tập</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <Download className="w-4 h-4" />
            Xuất PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Download className="w-4 h-4" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">Tất cả kỳ thi</option>
            {exams.map(exam => (
              <option key={exam.id} value={exam.id}>{exam.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{totalAttempts}</div>
          <div className="text-sm text-gray-600">Tổng số lần tham gia</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{averageScore}</div>
          <div className="text-sm text-gray-600">Điểm trung bình</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{completionRate}%</div>
          <div className="text-sm text-gray-600">Tỷ lệ hoàn thành</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Score Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Phân phối điểm số</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreRanges}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Participation by Exam Type */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Tham gia theo loại kỳ thi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Exam Performance */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Hiệu suất theo kỳ thi</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={examStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis yAxisId="left" orientation="left" stroke="#6366f1" />
            <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="Lượt thi" fill="#6366f1" />
            <Bar yAxisId="right" dataKey="Điểm TB" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pass/Fail by Type */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Tỷ lệ đạt/không đạt theo loại</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={typeStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="passed" name="Đạt" fill="#10b981" stackId="a" />
            <Bar dataKey="failed" name="Không đạt" fill="#ef4444" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
