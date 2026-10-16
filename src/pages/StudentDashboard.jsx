import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjectByEmail, updateProjectStatus } from '../services/db';
import { initiatePayment } from '../services/payment';
import { Download, CreditCard, Clock, CheckCircle, Loader2, Plus, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const STATUS_STEPS = ['Pending', 'Accepted', 'In Progress', 'Completed'];

const getStatusIndex = (status) => STATUS_STEPS.indexOf(status);

const StatusBadge = ({ status }) => {
  const config = {
    Pending: 'bg-amber-50 border-amber-200/80 text-amber-700',
    Accepted: 'bg-blue-50 border-blue-200/80 text-blue-700',
    'In Progress': 'bg-purple-50 border-purple-200/80 text-purple-700',
    Completed: 'bg-emerald-50 border-emerald-200/80 text-emerald-700',
    Rejected: 'bg-red-50 border-red-200/80 text-red-700',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${config[status] || config.Pending}`}>
      {status}
    </span>
  );
};

const PaymentBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${
    status === 'Paid' ? 'bg-emerald-50 border-emerald-200/80 text-emerald-700' : 'bg-amber-50 border-amber-200/80 text-amber-700'
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
              i < idx ? 'bg-blue-600 border-blue-600 text-white'
              : i === idx ? 'bg-blue-50 border-blue-600 text-blue-600'
              : 'bg-slate-100 border-slate-300 text-slate-400'
            }`}>
              {i < idx ? <CheckCircle size={14} /> : i + 1}
            </div>
            <span className={`text-[10px] mt-1 font-medium hidden sm:block ${i <= idx ? 'text-blue-600 font-semibold' : 'text-slate-400'}`}>{step}</span>
          </div>
        ))}
      </div>
      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
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

const ProjectCard = ({ project, onRefresh }) => {
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
        await updateProjectStatus(project.id, { paymentStatus: 'Paid', paymentId: response.razorpay_payment_id });
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
      className="bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 rounded-2xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-card"
    >
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap gap-3 items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{project.domain} Project</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{project.college}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={project.status} />
            <PaymentBadge status={project.paymentStatus || 'Pending'} />
          </div>
        </div>

        {project.status !== 'Rejected' && <ProgressBar status={project.status} />}

        {/* Payment-gated delivery banner */}
        {project.status === 'Completed' && project.deliveredLink && (project.paymentStatus || 'Pending') !== 'Paid' && (
          <div className="mt-4 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <span className="text-2xl">🔒</span>
            <div className="flex-1">
              <p className="text-amber-900 text-sm font-semibold">Project Ready! Complete payment to unlock.</p>
              <p className="text-amber-700 text-xs mt-0.5">Your project has been delivered. Pay the balance to access the download link.</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/60">
          {['Accepted', 'In Progress'].includes(project.status) && (project.paymentStatus || 'Pending') !== 'Paid' && (
            <button id={`pay-${project.id}`} onClick={handlePay} disabled={paying}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold transition-all shadow-sm shadow-blue-500/20 disabled:opacity-60">
              {paying ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CreditCard size={15} />}
              {paying ? 'Processing...' : `Pay Advance (50%) — ₹${Math.floor(Number(project.budget) * 0.5) || 499}`}
            </button>
          )}

          {project.status === 'Completed' && (project.paymentStatus || 'Pending') !== 'Paid' && (
            <button id={`pay-${project.id}`} onClick={handlePay} disabled={paying}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-bold transition-all shadow-sm disabled:opacity-60">
              {paying ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <span>🔓</span>}
              {paying ? 'Processing...' : `Unlock Project — ₹${Math.floor(Number(project.budget) * 0.5) || 499}`}
            </button>
          )}

          {project.status === 'Completed' && project.deliveredLink && project.paymentStatus === 'Paid' && (
            <a href={project.deliveredLink} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-sm font-semibold transition-all shadow-sm">
              <Download size={15} /> Download Deliverables
            </a>
          )}

          <button onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center gap-1.5 w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-sm transition-colors sm:ml-auto font-medium">
            {expanded ? <><ChevronUp size={15} /> Less</> : <><ChevronDown size={15} /> Details</>}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-slate-50/70 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-700/60">
            <div className="px-5 sm:px-6 pb-5 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
              <div><span className="text-slate-500 dark:text-slate-400 block text-xs">Agreed Budget</span><span className="text-slate-900 dark:text-white font-semibold">₹{project.budget}</span></div>
              <div><span className="text-slate-500 dark:text-slate-400 block text-xs">Target Deadline</span><span className="text-slate-900 dark:text-white font-semibold">{project.deadline || 'Flexible'}</span></div>
              <div className="sm:col-span-2"><span className="text-slate-500 dark:text-slate-400 block text-xs mb-1">Project Description</span><p className="text-slate-700 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm">{project.description}</p></div>
              {project.deliveredLink && (
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block text-xs mb-1">Delivered Link</span>
                  <a href={project.deliveredLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-semibold">
                    <ExternalLink size={14} /> Open Delivery Link
                  </a>
                </div>
              )}
              {project.createdAt && (
                <div><span className="text-slate-500 block text-xs">Request Date</span><span className="text-slate-600 text-xs">{new Date(project.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span></div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    const res = await getProjectByEmail(currentUser.email);
    if (res.success) setProjects(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const stats = {
    total: projects.length,
    pending: projects.filter(p => p.status === 'Pending').length,
    active: projects.filter(p => ['Accepted', 'In Progress'].includes(p.status)).length,
    completed: projects.filter(p => p.status === 'Completed').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/70 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-8 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            My Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, <span className="text-blue-600 dark:text-blue-400 font-semibold">{currentUser.displayName || currentUser.email}</span>
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Projects', value: stats.total, color: 'text-slate-900 dark:text-white' },
            { label: 'Pending', value: stats.pending, color: 'text-amber-600 dark:text-amber-400' },
            { label: 'Active', value: stats.active, color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Completed', value: stats.completed, color: 'text-emerald-600 dark:text-emerald-400' },
          ].map(({ label, value, color }) => (
            <motion.div key={label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 rounded-2xl p-4 text-center shadow-card">
              <p className={`text-3xl font-black ${color}`}>{value}</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-medium">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Projects header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Your Projects</h2>
          <button onClick={() => navigate('/submit')} id="new-project-btn"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-sm shadow-blue-500/20 transition-all">
            <Plus size={16} /> New Project
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={36} className="text-blue-600 animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-slate-900 font-bold text-xl mb-2">No Projects Yet</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">Submit your first project request to get started!</p>
            <button onClick={() => navigate('/submit')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md transition-all">
              Submit a Project
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onRefresh={fetchProjects} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
