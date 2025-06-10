import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/StudentList';
import AddStudent from './pages/AddStudent';
import MyInfo from './pages/MyInfo';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* 公开路由 */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* 受保护的路由 */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />

              {/* 学生管理相关路由 */}
              <Route path="students">
                <Route path="list" element={
                  <ProtectedRoute requiredRole="teacher">
                    <StudentList />
                  </ProtectedRoute>
                } />
                <Route path="add" element={
                  <ProtectedRoute requiredRole="teacher">
                    <AddStudent />
                  </ProtectedRoute>
                } />
                <Route path="my-info" element={
                  <ProtectedRoute requiredRole="student">
                    <MyInfo />
                  </ProtectedRoute>
                } />
              </Route>
            </Route>

            {/* 404 页面 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
