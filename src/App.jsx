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
    <div className="relative min-h-screen bg-[#f5f7fa] dark:bg-[#05070f] text-slate-900 dark:text-[#e8edf5] overflow-x-hidden">
      {/* ===== GLOBAL LIVE AMBIENT BACKGROUND OVERLAY (GPU ACCELERATED & ZERO LAG) ===== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Dot Matrix Grid */}
        <div className="absolute inset-0 bg-dot-grid opacity-60 dark:opacity-100" />

        {/* Persistent, GPU-accelerated ambient orbs with instant native class switching */}
        {/* Orb 1: Top-left */}
        <div className="absolute -top-32 -left-32 w-[380px] sm:w-[480px] h-[380px] sm:h-[480px] rounded-full bg-gradient-to-br from-blue-300/30 via-sky-200/20 to-transparent dark:from-[#1a3a6e]/75 dark:via-[#0f2244]/55 blur-[70px] sm:blur-[90px] animate-float-slow transform-gpu will-change-transform" />

        {/* Orb 2: Top-right */}
        <div className="absolute -top-16 -right-32 w-[360px] sm:w-[440px] h-[360px] sm:h-[440px] rounded-full bg-gradient-to-bl from-indigo-300/25 via-purple-200/20 to-transparent dark:from-[#0a2e3d]/80 dark:via-[#052030]/60 blur-[70px] sm:blur-[90px] animate-float-reverse transform-gpu will-change-transform" />

        {/* Orb 3: Bottom-center */}
        <div className="absolute bottom-0 left-[20%] w-[400px] sm:w-[500px] h-[340px] sm:h-[400px] rounded-full bg-gradient-to-tr from-cyan-200/25 via-blue-200/20 to-transparent dark:from-[#0e2456]/70 dark:via-[#071530]/50 blur-[70px] sm:blur-[90px] animate-float-drift transform-gpu will-change-transform" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {!isAuthPage && <Navbar />}
        <main className="flex-1" style={{ paddingTop: isAuthPage ? '0' : '64px' }}>
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
