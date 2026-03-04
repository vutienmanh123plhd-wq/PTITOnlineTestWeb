import { createHashRouter } from "react-router-dom";
import { AuthLayout } from "./components/layouts/AuthLayout";
import { UserLayout } from "./components/layouts/UserLayout";
import { AdminLayout } from "./components/layouts/AdminLayout";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { AdminLogin } from "./components/auth/AdminLogin";
import { ExamList } from "./components/user/ExamList";
import { TakeExam } from "./components/user/TakeExam";
import { ExamResult } from "./components/user/ExamResult";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { ManageExams } from "./components/admin/ManageExams";
import { CreateEditExam } from "./components/admin/CreateEditExam";
import { Statistics } from "./components/admin/Statistics";
import { StudentResults } from "./components/admin/StudentResults";
import { ManageUsers } from "./components/admin/ManageUsers";

export const router = createHashRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "/admin",
    children: [
      { index: true, element: <AdminLogin /> },
    ],
  },
  {
    path: "/user",
    element: <UserLayout />,
    children: [
      { index: true, element: <ExamList /> },
      { path: "exam/:examId", element: <TakeExam /> },
      { path: "result/:attemptId", element: <ExamResult /> },
    ],
  },
  {
    path: "/admin/dashboard",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "exams", element: <ManageExams /> },
      { path: "exams/create", element: <CreateEditExam /> },
      { path: "exams/edit/:examId", element: <CreateEditExam /> },
      { path: "users", element: <ManageUsers /> },
      { path: "statistics", element: <Statistics /> },
      { path: "students", element: <StudentResults /> },
    ],
  },
]);