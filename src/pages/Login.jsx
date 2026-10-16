import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ADMIN_EMAIL } from '../firebase/auth';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      const fromPath = location.state?.from?.pathname;
      navigate(result.user.email === ADMIN_EMAIL ? '/admin' : (fromPath || '/dashboard'), { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-50 px-4 py-8">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xl shadow-slate-200/50"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Link to="/" className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-3 text-blue-600 shadow-sm hover:scale-105 transition-transform">
            <LogIn size={26} />
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Pro<span className="text-blue-600">Build</span></h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back! Sign in to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input id="login-email" name="email" type="email" placeholder="Enter your email" value={form.email} onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm" />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={form.password} onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm text-center">
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <button id="login-submit" type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2">
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><LogIn size={17} /> SIGN IN</>
            )}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-slate-600">
          Not registered yet?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">Register here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
