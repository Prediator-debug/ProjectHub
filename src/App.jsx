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
    <div className="relative min-h-screen bg-[#f5f7fa] dark:bg-[#05070f] text-slate-900 dark:text-[#e8edf5] transition-colors duration-300 overflow-x-hidden">
      {/* ===== GLOBAL LIVE AMBIENT BACKGROUND OVERLAY ===== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Dot Matrix Grid */}
        <div className="absolute inset-0 bg-dot-grid opacity-60 dark:opacity-100" />

        {/* LIGHT MODE ORBS — soft blue/indigo */}
        <div className="dark:hidden absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-300/25 via-sky-200/20 to-transparent blur-[120px] animate-float-slow" />
        <div className="dark:hidden absolute top-[20%] -right-40 w-[450px] h-[450px] rounded-full bg-gradient-to-bl from-indigo-300/20 via-purple-200/15 to-transparent blur-[120px] animate-float-reverse" />
        <div className="dark:hidden absolute bottom-0 left-[20%] w-[500px] h-[400px] rounded-full bg-gradient-to-tr from-cyan-200/20 via-blue-200/15 to-transparent blur-[100px] animate-float-drift" />

        {/* DARK MODE ORBS — obsidian palette: deep teal + electric blue + violet */}
        {/* Orb 1: Top-left — electric indigo core */}
        <div className="hidden dark:block absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#1a3a6e]/70 via-[#0f2244]/50 to-transparent blur-[140px] animate-float-slow" />

        {/* Orb 2: Top-right — deep teal/cyan edge glow */}
        <div className="hidden dark:block absolute -top-20 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-[#0a2e3d]/80 via-[#052030]/60 to-transparent blur-[130px] animate-float-reverse" />

        {/* Orb 3: Mid-left — subtle violet accent */}
        <div className="hidden dark:block absolute top-[40%] -left-32 w-[400px] h-[500px] rounded-full bg-gradient-to-tr from-[#1a0a3e]/60 via-[#0d0520]/40 to-transparent blur-[120px] animate-float-drift" />

        {/* Orb 4: Bottom-right — electric blue warmth */}
        <div className="hidden dark:block absolute bottom-[-10%] -right-32 w-[550px] h-[450px] rounded-full bg-gradient-to-tl from-[#0e2456]/70 via-[#071530]/50 to-transparent blur-[140px] animate-float-slow" />

        {/* Orb 5: Bottom-left — teal accent */}
        <div className="hidden dark:block absolute bottom-[5%] -left-20 w-[380px] h-[380px] rounded-full bg-gradient-to-tr from-[#082535]/60 via-transparent to-transparent blur-[110px] animate-float-reverse" />
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
