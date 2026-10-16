import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjectByEmail, updateProjectStatus } from '../services/db';
import { initiatePayment } from '../services/payment';
import {
  Search,
  Mail,
  Clock,
  CheckCircle,
  CreditCard,
  Download,
  Loader2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

const STATUS_STEPS = ['Pending', 'Accepted', 'In Progress', 'Completed'];

const getStatusIndex = (status) => STATUS_STEPS.indexOf(status);

const StatusBadge = ({ status }) => {
  const config = {
    Pending: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200/80 dark:border-amber-800/80 text-amber-700 dark:text-amber-300',
    Accepted: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200/80 dark:border-blue-800/80 text-blue-700 dark:text-blue-300',
    'In Progress': 'bg-purple-50 dark:bg-purple-950/60 border-purple-200/80 dark:border-purple-800/80 text-purple-700 dark:text-purple-300',
    Completed: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300',
    Rejected: 'bg-red-50 dark:bg-red-950/60 border-red-200/80 dark:border-red-800/80 text-red-700 dark:text-red-300',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full border text-[11px] sm:text-xs font-semibold ${config[status] || config.Pending}`}>
      {status}
    </span>
  );
};

const PaymentBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full border text-[11px] sm:text-xs font-semibold ${
    status === 'Paid'
      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300'
      : 'bg-amber-50 dark:bg-amber-950/60 border-amber-200/80 dark:border-amber-800/80 text-amber-700 dark:text-amber-300'
  }`}>
    {status === 'Paid' ? <CheckCircle size={12} /> : <Clock size={12} />}
    {status}
  </span>
);

const ProgressBar = ({ status }) => {
  const idx = getStatusIndex(status);
  const steps = STATUS_STEPS;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, i) => (
          <div key={step} className="flex flex-col items-center flex-1">
            <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all ${
              i < idx
                ? 'bg-blue-600 border-blue-600 text-white'
                : i === idx
                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-600 dark:text-blue-400'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500'
            }`}>
              {i < idx ? <CheckCircle size={12} /> : i + 1}
            </div>
            <span className={`text-[10px] mt-1 font-medium hidden sm:block ${i <= idx ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-400 dark:text-slate-500'}`}>
              {step}
            </span>
          </div>
        ))}
      </div>
      <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(idx / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

const TrackingProjectCard = ({ project, onRefresh }) => {
  const [expanded, setExpanded] = useState(false);
  const [paying, setPaying] = useState(false);

  const handlePay = () => {
    setPaying(true);
    const timeout = setTimeout(() => setPaying(false), 120000);
    initiatePayment({
      project,
      amount: Math.floor(Number(project.budget) * 0.5) || 499,
      onSuccess: async (response) => {
        clearTimeout(timeout);
        await updateProjectStatus(project.id, {
          paymentStatus: 'Paid',
          paymentId: response.razorpay_payment_id,
        });
        onRefresh();
        setPaying(false);
      },
      onDismiss: () => {
        clearTimeout(timeout);
        setPaying(false);
      },
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 rounded-2xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-card"
    >
      <div className="p-4 sm:p-6">
        <div className="flex flex-wrap gap-2 sm:gap-3 items-start justify-between mb-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{project.domain} Project</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">{project.college}</p>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <StatusBadge status={project.status} />
            <PaymentBadge status={project.paymentStatus || 'Pending'} />
          </div>
        </div>

        {project.status !== 'Rejected' && <ProgressBar status={project.status} />}

        {/* Payment-gated delivery banner */}
        {project.status === 'Completed' && project.deliveredLink && (project.paymentStatus || 'Pending') !== 'Paid' && (
          <div className="mt-4 flex items-start sm:items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3 sm:px-4 sm:py-3">
            <span className="text-xl sm:text-2xl flex-shrink-0">🔒</span>
            <div className="flex-1">
              <p className="text-amber-900 text-xs sm:text-sm font-semibold">Project Ready! Complete payment to unlock.</p>
              <p className="text-amber-700 text-[11px] sm:text-xs mt-0.5 leading-relaxed">Your project has been delivered. Pay the balance to access the download link.</p>
            </div>
          </div>
        )}

        {/* Actions - responsive full width on mobile, inline on desktop */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-4 pt-3.5 border-t border-slate-100">
          {['Accepted', 'In Progress'].includes(project.status) && (project.paymentStatus || 'Pending') !== 'Paid' && (
            <button
              onClick={handlePay}
              disabled={paying}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-blue-500/20 disabled:opacity-60"
            >
              {paying ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <CreditCard size={15} />
              )}
              {paying ? 'Processing...' : `Pay Advance (50%) — ₹${Math.floor(Number(project.budget) * 0.5) || 499}`}
            </button>
          )}

          {project.status === 'Completed' && (project.paymentStatus || 'Pending') !== 'Paid' && (
            <button
              onClick={handlePay}
              disabled={paying}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-bold transition-all shadow-sm disabled:opacity-60"
            >
              {paying ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>🔓</span>
              )}
              {paying ? 'Processing...' : `Unlock Project — ₹${Math.floor(Number(project.budget) * 0.5) || 499}`}
            </button>
          )}

          {project.status === 'Completed' && project.deliveredLink && project.paymentStatus === 'Paid' && (
            <a
              href={project.deliveredLink}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-xs sm:text-sm font-semibold transition-all shadow-sm"
            >
              <Download size={15} /> Download Deliverables
            </a>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-xs sm:text-sm transition-colors sm:ml-auto font-medium"
          >
            {expanded ? <><ChevronUp size={15} /> Less</> : <><ChevronDown size={15} /> Details</>}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-50/70 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-700/60"
          >
            <div className="px-4 sm:px-6 pb-4 pt-3.5 grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] sm:text-xs">Agreed Budget</span>
                <span className="text-slate-900 dark:text-white font-semibold">₹{project.budget}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] sm:text-xs">Target Deadline</span>
                <span className="text-slate-900 dark:text-white font-semibold">{project.deadline || 'Flexible'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] sm:text-xs mb-1">Project Description</span>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                  {project.description}
                </p>
              </div>
              {project.deliveredLink && (
                <div className="col-span-2">
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px] sm:text-xs mb-1">Delivered Link</span>
                  <a
                    href={project.deliveredLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 text-xs sm:text-sm font-semibold break-all"
                  >
                    <ExternalLink size={14} className="flex-shrink-0" /> Open Delivery Link
                  </a>
                </div>
              )}
              {project.createdAt && (
                <div>
                  <span className="text-slate-500 block text-[11px] sm:text-xs">Request Date</span>
                  <span className="text-slate-600 text-[11px] sm:text-xs">
                    {new Date(project.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const StudentTracking = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [projects, setProjects] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.email) {
      setEmail(currentUser.email);
      performSearch(currentUser.email);
    }
  }, [currentUser]);

  const performSearch = async (targetEmail) => {
    if (!targetEmail.trim()) return;
    setLoading(true);
    const res = await getProjectByEmail(targetEmail.trim());
    if (res.success) {
      setProjects(res.data);
    } else {
      setProjects([]);
    }
    setSearched(true);
    setLoading(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch(email);
  };

  return (
    <div className="min-h-screen bg-transparent px-3 sm:px-4 py-8 sm:py-10 text-slate-900 dark:text-slate-100 overflow-x-hidden transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-7 sm:mb-10 px-2"
        >
          <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold mb-3 sm:mb-4 shadow-sm">
            <Zap size={14} className="text-amber-500 fill-amber-500" /> Real-time Project Tracker
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 sm:mb-3 tracking-tight">
            Track Your{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              Project Status
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-base max-w-xl mx-auto leading-relaxed">
            Check the live development status of your project, complete advance payments securely, and download completed deliverables.
          </p>
        </motion.div>

        {/* Search Bar Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/85 dark:bg-slate-800/85 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/80 rounded-2xl sm:rounded-3xl p-4 sm:p-8 mb-8 sm:mb-10 shadow-card"
        >
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <div className="relative flex-1">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="tracking-email"
                type="email"
                placeholder="Enter your registered email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl pl-11 sm:pl-12 pr-4 py-3 sm:py-3.5 text-slate-900 dark:text-white placeholder-slate-400 text-base sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
              />
            </div>
            <button
              id="tracking-search-btn"
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg shadow-blue-500/20 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Searching...
                </>
              ) : (
                <>
                  <Search size={18} /> Track Status
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center">
            <Loader2 size={36} className="text-blue-600 animate-spin mb-3 sm:mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">Searching projects for {email}...</p>
          </div>
        ) : searched && projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 sm:py-16 px-4 sm:px-6 bg-white/85 dark:bg-slate-800/85 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-sm"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto mb-3.5 sm:mb-4 text-2xl sm:text-3xl">
              🔍
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1.5 sm:mb-2">No Projects Found</h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-md mx-auto mb-5 sm:mb-6 leading-relaxed">
              We couldn't find any project requests submitted with <span className="text-blue-600 dark:text-blue-400 font-semibold break-all">{email}</span>. Please verify your email or submit a new project request.
            </p>
            <button
              onClick={() => navigate('/submit')}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all"
            >
              Submit a Project <ArrowRight size={15} />
            </button>
          </motion.div>
        ) : projects.length > 0 ? (
          <div className="space-y-4 sm:space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-1 px-1">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Found {projects.length} project{projects.length > 1 ? 's' : ''}
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Email: <span className="text-blue-600 dark:text-blue-400 font-semibold break-all">{email}</span>
              </span>
            </div>

            {projects.map((project) => (
              <TrackingProjectCard
                key={project.id}
                project={project}
                onRefresh={() => performSearch(email)}
              />
            ))}
          </div>
        ) : (
          /* Guide / Info cards when user hasn't searched yet */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
          >
            <div className="bg-white/85 dark:bg-slate-800/85 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 text-center shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2.5 sm:mb-3">
                <Clock size={18} />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm mb-1">Live Updates</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Track status in real-time from Pending to Accepted to Completed.
              </p>
            </div>

            <div className="bg-white/85 dark:bg-slate-800/85 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 text-center shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-800/80 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-2.5 sm:mb-3">
                <ShieldCheck size={18} />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm mb-1">Secure Razorpay</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Pay your 50% advance or unlock final deliverables with 100% secure payments.
              </p>
            </div>

            <div className="bg-white/85 dark:bg-slate-800/85 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 text-center shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2.5 sm:mb-3">
                <Download size={18} />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm mb-1">Instant Access</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Download your complete source code, report (PDF), and PPT presentation.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudentTracking;
