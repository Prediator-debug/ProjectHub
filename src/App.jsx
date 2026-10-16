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
    <div className="relative min-h-screen bg-[#f8fafc] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-200 overflow-x-hidden">
      {/* ===== GLOBAL LIVE AMBIENT BACKGROUND OVERLAY ===== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Crisp Tech Dot Matrix Grid across the entire app */}
        <div className="absolute inset-0 bg-dot-grid opacity-75 dark:opacity-35" />

        {/* Ambient Floating Gradient Orbs */}
        {/* Orb 1: Top-Left Cyan/Sky glowing aura */}
        <div className="absolute -top-32 -left-32 w-[420px] sm:w-[650px] h-[420px] sm:h-[650px] rounded-full bg-gradient-to-br from-blue-400/30 via-sky-300/25 to-indigo-300/15 dark:from-blue-600/20 dark:via-sky-900/15 dark:to-transparent blur-[100px] sm:blur-[130px] animate-float-slow" />

        {/* Orb 2: Top-Right Violet/Indigo glowing aura */}
        <div className="absolute top-[15%] -right-32 w-[380px] sm:w-[600px] h-[380px] sm:h-[600px] rounded-full bg-gradient-to-bl from-indigo-400/25 via-purple-300/20 to-blue-200/15 dark:from-indigo-600/20 dark:via-purple-900/15 dark:to-transparent blur-[100px] sm:blur-[130px] animate-float-reverse" />

        {/* Orb 3: Mid-page ambient azure light */}
        <div className="absolute top-[50%] -left-32 w-[400px] sm:w-[620px] h-[400px] sm:h-[620px] rounded-full bg-gradient-to-tr from-cyan-400/25 via-blue-300/20 to-transparent dark:from-cyan-900/15 dark:to-transparent blur-[110px]" />

        {/* Orb 4: Bottom ambient warmth & glow */}
        <div className="absolute top-[80%] -right-32 w-[420px] sm:w-[650px] h-[420px] sm:h-[650px] rounded-full bg-gradient-to-tl from-blue-500/25 via-indigo-400/20 to-transparent dark:from-blue-700/15 dark:to-transparent blur-[120px] animate-float-slow" />
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
