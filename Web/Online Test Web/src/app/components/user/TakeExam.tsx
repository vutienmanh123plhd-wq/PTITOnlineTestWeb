import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useApp } from '../../context/AppContext';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

export function TakeExam() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { exams, user, addAttempt } = useApp();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const exam = exams.find((e) => e.id === examId);

  useEffect(() => {
    if (exam) {
      setTimeLeft(exam.duration * 60); // Convert to seconds
    }
  }, [exam]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  if (!exam) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không tìm thấy bài thi</p>
      </div>
    );
  }

  const handleAnswerChange = (questionId: string, optionIndex: number) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleSubmit = () => {
    if (!user) return;

    // Calculate score
    let correctCount = 0;
    exam.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / exam.questions.length) * 100);
    const timeSpent = exam.duration - Math.floor(timeLeft / 60);

    const attempt = {
      id: `attempt-${Date.now()}`,
      examId: exam.id,
      userId: user.id,
      answers,
      score,
      completedAt: new Date().toISOString(),
      timeSpent,
    };

    addAttempt(attempt);
    navigate(`/user/result/${attempt.id}`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = exam.questions.length;
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-0 z-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{exam.title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {answeredCount}/{totalQuestions} câu đã trả lời
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <Clock className="w-5 h-5" />
              <span className="font-bold text-lg">{formatTime(timeLeft)}</span>
            </div>
            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Nộp bài
            </button>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {exam.questions.map((question, index) => (
          <div key={question.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                answers[question.id] !== undefined
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {question.question}
                </h3>
                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                        answers[question.id] === optionIndex
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        checked={answers[question.id] === optionIndex}
                        onChange={() => handleAnswerChange(question.id, optionIndex)}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <span className="ml-3 text-gray-900">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              {unansweredCount > 0 ? (
                <AlertCircle className="w-8 h-8 text-yellow-500" />
              ) : (
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              )}
              <h3 className="text-xl font-bold text-gray-900">
                Xác nhận nộp bài
              </h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-3">
                Bạn có chắc chắn muốn nộp bài không?
              </p>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng số câu:</span>
                  <span className="font-medium">{totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Đã trả lời:</span>
                  <span className="font-medium text-green-600">{answeredCount}</span>
                </div>
                {unansweredCount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chưa trả lời:</span>
                    <span className="font-medium text-red-600">{unansweredCount}</span>
                  </div>
                )}
              </div>
              {unansweredCount > 0 && (
                <p className="text-yellow-600 text-sm mt-3">
                  Bạn còn {unansweredCount} câu chưa trả lời. Các câu này sẽ được tính là sai.
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Nộp bài
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Time's up notification */}
      {timeLeft <= 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Hết giờ!</h3>
            <p className="text-gray-600">Bài thi của bạn đã được tự động nộp.</p>
          </div>
        </div>
      )}
    </div>
  );
}
