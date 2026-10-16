import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, LogIn, X, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ADMIN_EMAIL } from '../firebase/auth';

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500', textColor: 'text-red-500' };
  if (score === 2) return { score, label: 'Fair', color: 'bg-amber-500', textColor: 'text-amber-500' };
  if (score === 3) return { score, label: 'Good', color: 'bg-blue-500', textColor: 'text-blue-500' };
  return { score, label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-500' };
};

const AuthModal = () => {
  const navigate = useNavigate();
  const { authModal, closeAuthModal, setAuthModalTab, login, register } = useAuth();
  const { isOpen, tab, redirectTo } = authModal;

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [isOpen, tab]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeAuthModal]);

  if (!isOpen) return null;

  const strength = getPasswordStrength(registerForm.password);
  const passwordsMatch = registerForm.confirmPassword && registerForm.password === registerForm.confirmPassword;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    const result = await login(loginForm.email, loginForm.password);
    setLoading(false);

    if (result.success) {
      closeAuthModal();
      const target = result.user.email === ADMIN_EMAIL ? '/admin' : (redirectTo || '/submit');
      navigate(target);
    } else {
      setError(result.error);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (registerForm.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const result = await register(registerForm.name, registerForm.email, registerForm.password);
    setLoading(false);

    if (result.success) {
      closeAuthModal();
      navigate(redirectTo || '/submit');
    } else {
      setError(result.error);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-md max-h-[92vh] overflow-y-auto bg-white dark:bg-[#0d1117] border border-slate-200/90 dark:border-[#1c2a3e] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl z-10 text-slate-900 dark:text-[#e8edf5]"
        >
          {/* Close button with large touch target */}
          <button
            id="auth-modal-close"
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#161e2d] transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-5 sm:mb-6 pt-1">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-[#0a1628] border border-blue-100 dark:border-[#1c3a6e] flex items-center justify-center mb-3 text-blue-600 dark:text-[#4f8ef7] shadow-sm">
              {tab === 'login' ? <LogIn size={24} /> : <UserPlus size={24} />}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#e8edf5] tracking-tight">
              {tab === 'login' ? 'Sign In to Submit Project' : 'Create Account'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8b9ab4] mt-1 max-w-xs leading-relaxed">
              {tab === 'login'
                ? 'Sign in to submit your project requirements and track progress.'
                : 'Register in seconds to submit your project details and get a quick quote.'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-100 dark:bg-[#111827] p-1 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-[#1c2a3e] mb-5 sm:mb-6">
            <button
              type="button"
              id="auth-modal-tab-login"
              onClick={() => { setAuthModalTab('login'); setError(''); }}
              className={`flex-1 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                tab === 'login'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-[#8b9ab4] hover:text-slate-900 dark:hover:text-[#e8edf5]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              id="auth-modal-tab-register"
              onClick={() => { setAuthModalTab('register'); setError(''); }}
              className={`flex-1 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                tab === 'register'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-[#8b9ab4] hover:text-slate-900 dark:hover:text-[#e8edf5]'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-50 dark:bg-[#1a0a0a] border border-red-200 dark:border-[#3d1515] rounded-xl px-4 py-2.5 text-red-600 dark:text-red-400 text-xs sm:text-sm text-center mb-4"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab 1: Login Form */}
          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5 sm:space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-[#8b9ab4] uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="modal-login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginForm.email}
                    onChange={(e) => {
                      setLoginForm({ ...loginForm, email: e.target.value });
                      setError('');
                    }}
                    className="w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1c2a3e] rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-slate-900 dark:text-[#e8edf5] placeholder-slate-400 dark:placeholder-[#4a5a72] text-base sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-[#8b9ab4] uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    onClick={closeAuthModal}
                    className="text-xs text-blue-600 dark:text-[#4f8ef7] hover:text-blue-700 dark:hover:text-[#7ba8fa] font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="modal-login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => {
                      setLoginForm({ ...loginForm, password: e.target.value });
                      setError('');
                    }}
                    className="w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1c2a3e] rounded-xl pl-10 pr-10 py-2.5 sm:py-3 text-slate-900 dark:text-[#e8edf5] placeholder-slate-400 dark:placeholder-[#4a5a72] text-base sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                id="modal-login-submit"
                type="submit"
                disabled={loading}
                className="w-full py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={17} /> Sign In & Submit Project
                  </>
                )}
              </button>

              <p className="text-center text-xs sm:text-sm text-slate-600 dark:text-[#8b9ab4] pt-2">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthModalTab('register'); setError(''); }}
                  className="text-blue-600 dark:text-[#4f8ef7] font-semibold hover:text-blue-700 dark:hover:text-[#7ba8fa] transition-colors"
                >
                  Create one now
                </button>
              </p>
            </form>
          ) : (
            /* Tab 2: Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-[#8b9ab4] uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="modal-reg-name"
                    type="text"
                    placeholder="Enter your name"
                    value={registerForm.name}
                    onChange={(e) => {
                      setRegisterForm({ ...registerForm, name: e.target.value });
                      setError('');
                    }}
                    className="w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1c2a3e] rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-[#e8edf5] placeholder-slate-400 dark:placeholder-[#4a5a72] text-base sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-[#8b9ab4] uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="modal-reg-email"
                    type="email"
                    placeholder="Enter your email"
                    value={registerForm.email}
                    onChange={(e) => {
                      setRegisterForm({ ...registerForm, email: e.target.value });
                      setError('');
                    }}
                    className="w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1c2a3e] rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-[#e8edf5] placeholder-slate-400 dark:placeholder-[#4a5a72] text-base sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-[#8b9ab4] uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="modal-reg-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={registerForm.password}
                    onChange={(e) => {
                      setRegisterForm({ ...registerForm, password: e.target.value });
                      setError('');
                    }}
                    className="w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1c2a3e] rounded-xl pl-10 pr-10 py-2.5 text-slate-900 dark:text-[#e8edf5] placeholder-slate-400 dark:placeholder-[#4a5a72] text-base sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {registerForm.password && (
                  <div className="mt-1.5">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i <= strength.score ? strength.color : 'bg-slate-200 dark:bg-[#1c2a3e]'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-[11px] font-medium ${strength.textColor}`}>{strength.label} password</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-[#8b9ab4] uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="modal-reg-confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={registerForm.confirmPassword}
                    onChange={(e) => {
                      setRegisterForm({ ...registerForm, confirmPassword: e.target.value });
                      setError('');
                    }}
                    className="w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1c2a3e] rounded-xl pl-10 pr-10 py-2.5 text-slate-900 dark:text-[#e8edf5] placeholder-slate-400 dark:placeholder-[#4a5a72] text-base sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  {registerForm.confirmPassword && (
                    <div className="absolute right-10 top-1/2 -translate-y-1/2">
                      {passwordsMatch ? (
                        <CheckCircle size={15} className="text-emerald-500" />
                      ) : (
                        <XCircle size={15} className="text-red-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button
                id="modal-reg-submit"
                type="submit"
                disabled={loading}
                className="w-full py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus size={17} /> Register & Continue
                  </>
                )}
              </button>

              <p className="text-center text-xs sm:text-sm text-slate-600 dark:text-[#8b9ab4] pt-1">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthModalTab('login'); setError(''); }}
                  className="text-blue-600 dark:text-[#4f8ef7] font-semibold hover:text-blue-700 dark:hover:text-[#7ba8fa] transition-colors"
                >
                  Sign in here
                </button>
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
