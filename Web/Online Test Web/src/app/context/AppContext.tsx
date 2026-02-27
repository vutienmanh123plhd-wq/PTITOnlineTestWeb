import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface Exam {
  id: string;
  title: string;
  description: string;
  type: 'practice' | 'midterm' | 'final';
  status: 'free' | 'scheduled';
  duration: number; // in minutes
  startTime?: string;
  endTime?: string;
  questions: Question[];
}

interface ExamAttempt {
  id: string;
  examId: string;
  userId: string;
  answers: Record<string, number>;
  score: number;
  completedAt: string;
  timeSpent: number;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  exams: Exam[];
  setExams: (exams: Exam[]) => void;
  attempts: ExamAttempt[];
  addAttempt: (attempt: ExamAttempt) => void;
  users: User[];
  setUsers: (users: User[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const mockExams: Exam[] = [
  {
    id: '1',
    title: 'Luyện tập - Toán học cơ bản',
    description: 'Bài luyện tập về các phép tính cơ bản và đại số',
    type: 'practice',
    status: 'free',
    duration: 30,
    questions: [
      {
        id: 'q1',
        question: 'Kết quả của phép tính 2 + 2 là gì?',
        options: ['3', '4', '5', '6'],
        correctAnswer: 1,
        explanation: '2 + 2 = 4',
      },
      {
        id: 'q2',
        question: 'Căn bậc hai của 16 là bao nhiêu?',
        options: ['2', '3', '4', '8'],
        correctAnswer: 2,
        explanation: '√16 = 4',
      },
      {
        id: 'q3',
        question: '5 x 7 = ?',
        options: ['30', '35', '40', '45'],
        correctAnswer: 1,
        explanation: '5 x 7 = 35',
      },
      {
        id: 'q4',
        question: '100 ÷ 4 = ?',
        options: ['20', '25', '30', '35'],
        correctAnswer: 1,
        explanation: '100 ÷ 4 = 25',
      },
      {
        id: 'q5',
        question: '2³ = ?',
        options: ['4', '6', '8', '9'],
        correctAnswer: 2,
        explanation: '2³ = 2 x 2 x 2 = 8',
      },
    ],
  },
  {
    id: '2',
    title: 'Kiểm tra giữa kỳ - Lập trình C++',
    description: 'Kiểm tra kiến thức về cú pháp và OOP trong C++',
    type: 'midterm',
    status: 'scheduled',
    duration: 60,
    startTime: '2026-03-01T09:00:00',
    endTime: '2026-03-01T11:00:00',
    questions: [
      {
        id: 'q1',
        question: 'Từ khóa nào dùng để khai báo lớp trong C++?',
        options: ['class', 'struct', 'object', 'define'],
        correctAnswer: 0,
        explanation: 'Từ khóa "class" được sử dụng để khai báo lớp trong C++',
      },
      {
        id: 'q2',
        question: 'Con trỏ trong C++ được khai báo bằng ký tự nào?',
        options: ['&', '*', '#', '@'],
        correctAnswer: 1,
        explanation: 'Dấu * được dùng để khai báo con trỏ',
      },
      {
        id: 'q3',
        question: 'Hàm main() trả về kiểu dữ liệu gì?',
        options: ['void', 'int', 'float', 'char'],
        correctAnswer: 1,
        explanation: 'Hàm main() trả về kiểu int',
      },
      {
        id: 'q4',
        question: 'Toán tử nào dùng để truy cập thành viên của con trỏ?',
        options: ['.', '->', '::', '::*'],
        correctAnswer: 1,
        explanation: 'Toán tử -> dùng để truy cập thành viên qua con trỏ',
      },
      {
        id: 'q5',
        question: 'Tính năng nào KHÔNG phải là đặc trưng của OOP?',
        options: ['Đóng gói', 'Kế thừa', 'Đa hình', 'Biên dịch'],
        correctAnswer: 3,
        explanation: 'Biên dịch không phải là đặc trưng của OOP',
      },
      {
        id: 'q6',
        question: 'Kích thước của kiểu int thường là bao nhiêu byte?',
        options: ['1', '2', '4', '8'],
        correctAnswer: 2,
        explanation: 'Kiểu int thường có kích thước 4 bytes',
      },
      {
        id: 'q7',
        question: 'Từ khóa nào dùng để tạo hàm ảo trong C++?',
        options: ['virtual', 'abstract', 'override', 'static'],
        correctAnswer: 0,
        explanation: 'Từ khóa "virtual" dùng để tạo hàm ảo',
      },
      {
        id: 'q8',
        question: 'Constructor có tên như thế nào?',
        options: ['Tên bất kỳ', 'Trùng tên lớp', 'main', 'init'],
        correctAnswer: 1,
        explanation: 'Constructor phải trùng tên với lớp',
      },
    ],
  },
  {
    id: '3',
    title: 'Thi cuối kỳ - Cấu trúc dữ liệu',
    description: 'Đánh giá kiến thức về các cấu trúc dữ liệu và thuật toán',
    type: 'final',
    status: 'scheduled',
    duration: 90,
    startTime: '2026-03-15T13:00:00',
    endTime: '2026-03-15T16:00:00',
    questions: [
      {
        id: 'q1',
        question: 'Cấu trúc dữ liệu nào hoạt động theo nguyên tắc LIFO?',
        options: ['Queue', 'Stack', 'Tree', 'Graph'],
        correctAnswer: 1,
        explanation: 'Stack hoạt động theo nguyên tắc Last In First Out (LIFO)',
      },
      {
        id: 'q2',
        question: 'Độ phức tạp trung bình của Binary Search là gì?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 1,
        explanation: 'Binary Search có độ phức tạp O(log n)',
      },
      {
        id: 'q3',
        question: 'Cây nhị phân tìm kiếm (BST) có tính chất gì?',
        options: [
          'Node trái > Node gốc > Node phải',
          'Node trái < Node gốc < Node phải',
          'Node trái = Node gốc = Node phải',
          'Không có quy tắc',
        ],
        correctAnswer: 1,
        explanation: 'BST: Node trái < Node gốc < Node phải',
      },
      {
        id: 'q4',
        question: 'Hash Table sử dụng kỹ thuật nào để xử lý collision?',
        options: ['Sorting', 'Chaining', 'Binary Search', 'Recursion'],
        correctAnswer: 1,
        explanation: 'Chaining là một kỹ thuật phổ biến xử lý collision',
      },
      {
        id: 'q5',
        question: 'Thuật toán nào KHÔNG phải là thuật toán sắp xếp?',
        options: ['Quick Sort', 'Merge Sort', 'Binary Search', 'Bubble Sort'],
        correctAnswer: 2,
        explanation: 'Binary Search là thuật toán tìm kiếm, không phải sắp xếp',
      },
      {
        id: 'q6',
        question: 'Độ phức tạp của Quick Sort trong trường hợp tốt nhất?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        correctAnswer: 1,
        explanation: 'Quick Sort có độ phức tạp O(n log n) trong trường hợp tốt nhất',
      },
      {
        id: 'q7',
        question: 'Cấu trúc dữ liệu nào thích hợp cho BFS?',
        options: ['Stack', 'Queue', 'Array', 'Linked List'],
        correctAnswer: 1,
        explanation: 'BFS (Breadth First Search) sử dụng Queue',
      },
      {
        id: 'q8',
        question: 'Linked List có ưu điểm gì so với Array?',
        options: [
          'Truy cập nhanh hơn',
          'Chèn/xóa linh hoạt hơn',
          'Tiết kiệm bộ nhớ hơn',
          'Đơn giản hơn',
        ],
        correctAnswer: 1,
        explanation: 'Linked List cho phép chèn/xóa phần tử linh hoạt hơn',
      },
      {
        id: 'q9',
        question: 'Heap là cấu trúc dữ liệu dạng gì?',
        options: ['Linear', 'Tree', 'Graph', 'Hash'],
        correctAnswer: 1,
        explanation: 'Heap là một cấu trúc dữ liệu dạng cây',
      },
      {
        id: 'q10',
        question: 'DFS sử dụng cấu trúc dữ liệu nào?',
        options: ['Queue', 'Stack', 'Heap', 'Hash Table'],
        correctAnswer: 1,
        explanation: 'DFS (Depth First Search) sử dụng Stack hoặc đệ quy',
      },
    ],
  },
  {
    id: '4',
    title: 'Luyện tập - Tiếng Anh cơ bản',
    description: 'Bài tập về ngữ pháp và từ vựng tiếng Anh',
    type: 'practice',
    status: 'free',
    duration: 20,
    questions: [
      {
        id: 'q1',
        question: 'Choose the correct form: She ___ to school every day.',
        options: ['go', 'goes', 'going', 'gone'],
        correctAnswer: 1,
        explanation: 'Với chủ ngữ số ít ngôi thứ ba, động từ thêm "s"',
      },
      {
        id: 'q2',
        question: 'What is the past tense of "eat"?',
        options: ['eated', 'ate', 'eaten', 'eating'],
        correctAnswer: 1,
        explanation: 'Quá khứ của "eat" là "ate"',
      },
      {
        id: 'q3',
        question: 'Which word is a noun?',
        options: ['quickly', 'happiness', 'beautiful', 'run'],
        correctAnswer: 1,
        explanation: '"Happiness" là danh từ',
      },
    ],
  },
];

const mockUsers: User[] = [
  { id: '1', username: 'student1', email: 'student1@example.com', role: 'user' },
  { id: '2', username: 'student2', email: 'student2@example.com', role: 'user' },
  { id: '3', username: 'student3', email: 'student3@example.com', role: 'user' },
  { id: '4', username: 'admin', email: 'admin@example.com', role: 'admin' },
];

const mockAttempts: ExamAttempt[] = [
  {
    id: 'a1',
    examId: '1',
    userId: '1',
    answers: { q1: 1, q2: 2, q3: 1, q4: 1, q5: 2 },
    score: 100,
    completedAt: '2026-02-20T10:30:00',
    timeSpent: 15,
  },
  {
    id: 'a2',
    examId: '1',
    userId: '2',
    answers: { q1: 1, q2: 2, q3: 0, q4: 1, q5: 2 },
    score: 80,
    completedAt: '2026-02-21T14:20:00',
    timeSpent: 18,
  },
  {
    id: 'a3',
    examId: '4',
    userId: '1',
    answers: { q1: 1, q2: 1, q3: 1 },
    score: 100,
    completedAt: '2026-02-22T09:15:00',
    timeSpent: 8,
  },
  {
    id: 'a4',
    examId: '1',
    userId: '3',
    answers: { q1: 0, q2: 2, q3: 1, q4: 0, q5: 1 },
    score: 40,
    completedAt: '2026-02-23T11:45:00',
    timeSpent: 25,
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [attempts, setAttempts] = useState<ExamAttempt[]>(mockAttempts);
  const [users, setUsers] = useState<User[]>(mockUsers);

  const addAttempt = (attempt: ExamAttempt) => {
    setAttempts([...attempts, attempt]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        exams,
        setExams,
        attempts,
        addAttempt,
        users,
        setUsers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
