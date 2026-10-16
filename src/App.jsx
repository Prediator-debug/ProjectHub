import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import SubmitForm from './pages/SubmitForm';
import AdminDashboard from './pages/AdminDashboard';
import StudentTracking from './pages/StudentTracking';
import StudentDashboard from './pages/StudentDashboard';
import './index.css';

const AppRoutes = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  return (
    <div className="app-container">
      {!isAuthPage && <Navbar />}
      <main style={{ paddingTop: isAuthPage ? '0' : '64px', minHeight: '100vh' }}>
        <Routes>
          {/* Public visitor routes */}
          <Route path="/" element={<Home />} />
          <Route path="/track" element={<StudentTracking />} />

          {/* Public auth routes (redirect to home if already logged in) */}
          <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" replace />} />
          <Route path="/register" element={!currentUser ? <Register /> : <Navigate to="/" replace />} />
          <Route path="/forgot-password" element={!currentUser ? <ForgotPassword /> : <Navigate to="/" replace />} />

          {/* Protected student routes */}
          <Route path="/submit" element={<ProtectedRoute><SubmitForm /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />

          {/* Protected admin routes */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />

          {/* Catch-all redirects to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <AuthModal />
    </div>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
