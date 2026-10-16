import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
  const { sendResetEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email address.'); return; }
    setStatus('loading');
    const result = await sendResetEmail(email);
    if (result.success) {
      setStatus('success');
    } else {
      setStatus('error');
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
        transition={{ duration: 0.35 }}
        className="relative w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xl shadow-slate-200/50"
      >
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6 font-medium">
          <ArrowLeft size={16} /> Back to Login
        </Link>

        {status === 'success' ? (
          <div className="text-center py-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
              className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-emerald-600" />
            </motion.div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Email Sent!</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              We've sent a password reset link to <span className="text-blue-600 font-semibold">{email}</span>.
              Check your inbox (and spam folder).
            </p>
            <Link to="/login" className="mt-6 inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-md transition-all">
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-3 text-blue-600 shadow-sm">
                <Mail size={26} />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Forgot Password?</h1>
              <p className="text-sm text-slate-500 mt-1 text-center">
                Enter your email and we'll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="forgot-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); setStatus('idle'); }}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                  />
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm text-center">
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <button id="forgot-submit" type="submit" disabled={status === 'loading'}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed">
                {status === 'loading' ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Send size={17} /> Send Reset Link</>
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
