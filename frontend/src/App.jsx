import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import StudentDashboard from './pages/student/StudentDashboard';
import Courses from './pages/Courses';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCourses from './pages/admin/ManageCourses';
import StudentDetail from './pages/admin/StudentDetail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Unauthorized from './pages/Unauthorized';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="verify/:token" element={<VerifyEmail />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />

          <Route element={<ProtectedRoute allowedRoles={['Student', 'Admin']} />}>
            <Route path="student" element={<StudentDashboard />} />
            <Route path="courses" element={<Courses />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="manage-courses" element={<ManageCourses />} />
            <Route path="student-detail/:id" element={<StudentDetail />} />
          </Route>

          <Route path="*" element={
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
                <Navigate to="/login" replace />
            </div>
          } />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;