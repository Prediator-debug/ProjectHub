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
    Pending: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    Accepted: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    'In Progress': 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    Completed: 'bg-green-500/10 border-green-500/30 text-green-400',
    Rejected: 'bg-red-500/10 border-red-500/30 text-red-400',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${config[status] || config.Pending}`}>
      {status}
    </span>
  );
};

const PaymentBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${
    status === 'Paid' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-orange-500/10 border-orange-500/30 text-orange-400'
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
            <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
              i < idx
                ? 'bg-brand-500 border-brand-500 text-white'
                : i === idx
                ? 'bg-brand-500/20 border-brand-500 text-brand-400'
                : 'bg-white/5 border-white/20 text-gray-600'
            }`}>
              {i < idx ? <CheckCircle size={14} /> : i + 1}
            </div>
            <span className={`text-[10px] mt-1 font-medium hidden sm:block ${i <= idx ? 'text-brand-400' : 'text-gray-600'}`}>
              {step}
            </span>
          </div>
        ))}
      </div>
      <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full"
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-brand-500/20 transition-all shadow-card"
    >
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap gap-3 items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-white">{project.domain} Project</h3>
            <p className="text-gray-400 text-sm mt-0.5">{project.college}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={project.status} />
            <PaymentBadge status={project.paymentStatus || 'Pending'} />
          </div>
        </div>

        {project.status !== 'Rejected' && <ProgressBar status={project.status} />}

        {/* Payment-gated delivery banner */}
        {project.status === 'Completed' && project.deliveredLink && (project.paymentStatus || 'Pending') !== 'Paid' && (
          <div className="mt-4 flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
            <span className="text-2xl">🔒</span>
            <div className="flex-1">
              <p className="text-amber-300 text-sm font-semibold">Project Ready! Complete payment to unlock.</p>
              <p className="text-amber-500/70 text-xs mt-0.5">Your project has been delivered. Pay the balance to access the download link.</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 mt-5 pt-3 border-t border-white/5">
          {/* Pay button — shown when not paid and project is active */}
          {['Accepted', 'In Progress'].includes(project.status) && (project.paymentStatus || 'Pending') !== 'Paid' && (
            <button
              onClick={handlePay}
              disabled={paying}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white text-sm font-semibold transition-all shadow-glow disabled:opacity-60"
            >
              {paying ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <CreditCard size={15} />
              )}
              {paying ? 'Processing...' : `Pay Advance (50%) — ₹${Math.floor(Number(project.budget) * 0.5) || 499}`}
            </button>
          )}

          {/* Unlock button — shown when Completed + unpaid */}
          {project.status === 'Completed' && (project.paymentStatus || 'Pending') !== 'Paid' && (
            <button
              onClick={handlePay}
              disabled={paying}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold transition-all shadow-lg disabled:opacity-60"
            >
              {paying ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>🔓</span>
              )}
              {paying ? 'Processing...' : `Unlock Project — ₹${Math.floor(Number(project.budget) * 0.5) || 499}`}
            </button>
          )}

          {/* Download — only shown AFTER payment */}
          {project.status === 'Completed' && project.deliveredLink && project.paymentStatus === 'Paid' && (
            <a
              href={project.deliveredLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 text-sm font-semibold transition-all shadow-sm"
            >
              <Download size={15} /> Download Project Deliverables
            </a>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 text-gray-400 hover:text-white text-sm transition-colors ml-auto"
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
            className="overflow-hidden bg-white/[0.02]"
          >
            <div className="px-5 sm:px-6 pb-5 pt-4 border-t border-white/5 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block text-xs">Agreed Budget</span>
                <span className="text-white font-medium">₹{project.budget}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Target Deadline</span>
                <span className="text-white font-medium">{project.deadline || 'Flexible'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 block text-xs mb-1">Project Description</span>
                <p className="text-gray-300 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5 text-xs sm:text-sm">
                  {project.description}
                </p>
              </div>
              {project.deliveredLink && (
                <div className="col-span-2">
                  <span className="text-gray-500 block text-xs mb-1">Delivered Link</span>
                  <a
                    href={project.deliveredLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-400 hover:text-brand-300 flex items-center gap-1 text-sm font-medium"
                  >
                    <ExternalLink size={14} /> Open Delivery Link
                  </a>
                </div>
              )}
              {project.createdAt && (
                <div>
                  <span className="text-gray-500 block text-xs">Request Date</span>
                  <span className="text-gray-300 text-xs">
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

  // Automatically pre-fill and search if user is logged in
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
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 px-4 py-10 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-4">
            <Zap size={14} className="text-yellow-400" /> Real-time Project Tracker
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
            Track Your{' '}
            <span className="bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Project Status
            </span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            Check the live development status of your project, complete advance payments securely, and download completed deliverables.
          </p>
        </motion.div>

        {/* Search Bar Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 mb-10 shadow-card"
        >
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                id="tracking-email"
                type="email"
                placeholder="Enter your registered email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50 transition-all"
              />
            </div>
            <button
              id="tracking-search-btn"
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
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
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 size={40} className="text-brand-400 animate-spin mb-4" />
            <p className="text-gray-400 text-sm">Searching projects for {email}...</p>
          </div>
        ) : searched && projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 px-6 bg-white/5 border border-white/10 rounded-3xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-3xl">
              🔍
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Projects Found</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
              We couldn't find any project requests submitted with <span className="text-brand-400 font-medium">{email}</span>. Please verify your email or submit a new project request.
            </p>
            <button
              onClick={() => navigate('/submit')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-semibold text-sm shadow-glow transition-all"
            >
              Submit a Project <ArrowRight size={16} />
            </button>
          </motion.div>
        ) : projects.length > 0 ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-bold text-white">
                Found {projects.length} project{projects.length > 1 ? 's' : ''}
              </h2>
              <span className="text-xs text-gray-400">
                Email: <span className="text-brand-400">{email}</span>
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
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-3">
                <Clock size={20} />
              </div>
              <h4 className="font-bold text-white text-sm mb-1">Live Updates</h4>
              <p className="text-gray-400 text-xs">
                Track status in real-time from Pending to Accepted to Completed.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-3">
                <ShieldCheck size={20} />
              </div>
              <h4 className="font-bold text-white text-sm mb-1">Secure Razorpay</h4>
              <p className="text-gray-400 text-xs">
                Pay your 50% advance or unlock final deliverables with 100% secure payments.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-3">
                <Download size={20} />
              </div>
              <h4 className="font-bold text-white text-sm mb-1">Instant Access</h4>
              <p className="text-gray-400 text-xs">
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
