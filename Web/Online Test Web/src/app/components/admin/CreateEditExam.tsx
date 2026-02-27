import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useApp } from '../../context/AppContext';
import { Plus, Trash2, Save, ArrowLeft, Upload } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export function CreateEditExam() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { exams, setExams } = useApp();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'practice' | 'midterm' | 'final'>('practice');
  const [status, setStatus] = useState<'free' | 'scheduled'>('free');
  const [duration, setDuration] = useState(30);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState('');

  const isEdit = !!examId;
  const exam = isEdit ? exams.find((e) => e.id === examId) : null;

  useEffect(() => {
    if (exam) {
      setTitle(exam.title);
      setDescription(exam.description);
      setType(exam.type);
      setStatus(exam.status);
      setDuration(exam.duration);
      setStartTime(exam.startTime || '');
      setEndTime(exam.endTime || '');
      setQuestions(exam.questions);
    }
  }, [exam]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q-${Date.now()}`,
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
      },
    ]);
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !description) {
      setError('Vui lòng nhập đầy đủ thông tin kỳ thi');
      return;
    }

    if (questions.length === 0) {
      setError('Vui lòng thêm ít nhất một câu hỏi');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setError(`Câu hỏi ${i + 1} không được để trống`);
        return;
      }
      if (q.options.some((opt) => !opt.trim())) {
        setError(`Câu hỏi ${i + 1} phải có đầy đủ các lựa chọn`);
        return;
      }
    }

    const examData = {
      id: isEdit ? examId : `exam-${Date.now()}`,
      title,
      description,
      type,
      status,
      duration,
      startTime: status === 'scheduled' ? startTime : undefined,
      endTime: status === 'scheduled' ? endTime : undefined,
      questions,
    };

    if (isEdit) {
      setExams(exams.map((e) => (e.id === examId ? examData : e)));
    } else {
      setExams([...exams, examData]);
    }

    navigate('/admin/dashboard/exams');
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Mock file import - in reality would parse Excel file
    alert('Tính năng import từ Excel đang được phát triển. Vui lòng thêm câu hỏi thủ công.');
  };

  return (
    <div>
      <button
        onClick={() => navigate('/admin/dashboard/exams')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại danh sách
      </button>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {isEdit ? 'Chỉnh sửa kỳ thi' : 'Tạo kỳ thi mới'}
        </h2>
        <p className="text-gray-600">Điền thông tin và câu hỏi cho kỳ thi</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Thông tin kỳ thi</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên kỳ thi *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Nhập tên kỳ thi"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Mô tả về kỳ thi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại kỳ thi *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="practice">Luyện tập</option>
                <option value="midterm">Giữa kỳ</option>
                <option value="final">Cuối kỳ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="free">Tự do</option>
                <option value="scheduled">Theo lịch</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời gian làm bài (phút) *
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {status === 'scheduled' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian bắt đầu
                  </label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian kết thúc
                  </label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Questions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Câu hỏi</h3>
            <div className="flex gap-2">
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition cursor-pointer">
                <Upload className="w-4 h-4" />
                Import Excel
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <Plus className="w-4 h-4" />
                Thêm câu hỏi
              </button>
            </div>
          </div>

          {questions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Chưa có câu hỏi nào. Nhấn "Thêm câu hỏi" để bắt đầu.
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q, qIndex) => (
                <div key={q.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
                      {qIndex + 1}
                    </div>
                    <div className="flex-1 space-y-4">
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                        placeholder="Nhập câu hỏi"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Các lựa chọn (chọn đáp án đúng):
                        </label>
                        {q.options.map((opt, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`correct-${q.id}`}
                              checked={q.correctAnswer === oIndex}
                              onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                              className="w-4 h-4 text-indigo-600"
                            />
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                              placeholder={`Lựa chọn ${oIndex + 1}`}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          </div>
                        ))}
                      </div>

                      <input
                        type="text"
                        value={q.explanation || ''}
                        onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                        placeholder="Giải thích (tùy chọn)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteQuestion(qIndex)}
                      className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard/exams')}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <Save className="w-5 h-5" />
            {isEdit ? 'Lưu thay đổi' : 'Tạo kỳ thi'}
          </button>
        </div>
      </form>
    </div>
  );
}
