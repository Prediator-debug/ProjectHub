import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjectByEmail, updateProjectStatus } from '../services/db';
import { initiatePayment } from '../services/payment';
import { Download, CreditCard, Clock, CheckCircle, XCircle, Loader2, Plus, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

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
              i < idx ? 'bg-brand-500 border-brand-500 text-white'
              : i === idx ? 'bg-brand-500/20 border-brand-500 text-brand-400'
              : 'bg-white/5 border-white/20 text-gray-600'
            }`}>
              {i < idx ? <CheckCircle size={14} /> : i + 1}
            </div>
            <span className={`text-[10px] mt-1 font-medium hidden sm:block ${i <= idx ? 'text-brand-400' : 'text-gray-600'}`}>{step}</span>
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

const ProjectCard = ({ project, onPayment, onRefresh }) => {
  const [expanded, setExpanded] = useState(false);
  const [paying, setPaying] = useState(false);

  const handlePay = () => {
    setPaying(true);
    // Fallback: auto-reset after 2 min if dismiss event doesn't fire
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
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-brand-500/20 transition-all"
    >
      <div className="p-5">
        <div className="flex flex-wrap gap-3 items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-white">{project.domain} Project</h3>
            <p className="text-gray-400 text-sm mt-0.5">{project.college}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={project.status} />
            <PaymentBadge status={project.paymentStatus} />
          </div>
        </div>

        {project.status !== 'Rejected' && <ProgressBar status={project.status} />}

        {/* Payment-gated delivery banner */}
        {project.status === 'Completed' && project.deliveredLink && (project.paymentStatus || 'Pending') !== 'Paid' && (
          <div className="mt-4 flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
            <span className="text-2xl">🔒</span>
            <div className="flex-1">
              <p className="text-amber-300 text-sm font-semibold">Project Ready! Complete payment to unlock.</p>
              <p className="text-amber-500/70 text-xs mt-0.5">Your project has been delivered. Pay to access the download link.</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-4">
          {/* Pay button — shown when not paid and project is active/done */}
          {['Accepted', 'In Progress'].includes(project.status) && (project.paymentStatus || 'Pending') !== 'Paid' && (
            <button id={`pay-${project.id}`} onClick={handlePay} disabled={paying}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white text-sm font-semibold transition-all disabled:opacity-60">
              {paying ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CreditCard size={15} />}
              {paying ? 'Processing...' : `Pay Advance (50%) — ₹${Math.floor(Number(project.budget) * 0.5) || 499}`}
            </button>
          )}
          {/* Unlock button — shown when Completed + unpaid */}
          {project.status === 'Completed' && (project.paymentStatus || 'Pending') !== 'Paid' && (
            <button id={`pay-${project.id}`} onClick={handlePay} disabled={paying}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold transition-all disabled:opacity-60 shadow-lg">
              {paying ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <span>🔓</span>}
              {paying ? 'Processing...' : `Unlock Project — ₹${Math.floor(Number(project.budget) * 0.5) || 499}`}
            </button>
          )}
          {/* Download — only shown AFTER payment */}
          {project.status === 'Completed' && project.deliveredLink && project.paymentStatus === 'Paid' && (
            <a href={project.deliveredLink} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 text-sm font-semibold transition-all">
              <Download size={15} /> Download Project
            </a>
          )}
          <button onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 text-gray-400 hover:text-white text-sm transition-colors ml-auto">
            {expanded ? <><ChevronUp size={15} /> Less</> : <><ChevronDown size={15} /> Details</>}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-5 pb-5 border-t border-white/5 pt-4 grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500 block text-xs">Budget</span><span className="text-white font-medium">₹{project.budget}</span></div>
              <div><span className="text-gray-500 block text-xs">Deadline</span><span className="text-white font-medium">{project.deadline}</span></div>
              <div className="col-span-2"><span className="text-gray-500 block text-xs mb-1">Description</span><p className="text-gray-300 leading-relaxed">{project.description}</p></div>
              {project.deliveredLink && (
                <div className="col-span-2">
                  <span className="text-gray-500 block text-xs mb-1">Delivery Link</span>
                  <a href={project.deliveredLink} target="_blank" rel="noreferrer" className="text-brand-400 hover:text-brand-300 flex items-center gap-1 text-sm">
                    <ExternalLink size={13} /> View Project
                  </a>
                </div>
              )}
              <div><span className="text-gray-500 block text-xs">Submitted</span><span className="text-gray-300">{new Date(project.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span></div>
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
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-black text-white">
            My Dashboard
          </h1>
          <p className="text-gray-400 mt-1">
            Welcome back, <span className="text-brand-400 font-medium">{currentUser.displayName || currentUser.email}</span>
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Projects', value: stats.total, color: 'text-white' },
            { label: 'Pending', value: stats.pending, color: 'text-yellow-400' },
            { label: 'Active', value: stats.active, color: 'text-blue-400' },
            { label: 'Completed', value: stats.completed, color: 'text-green-400' },
          ].map(({ label, value, color }) => (
            <motion.div key={label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <p className={`text-3xl font-black ${color}`}>{value}</p>
              <p className="text-gray-500 text-xs mt-1">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Projects */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Your Projects</h2>
          <button onClick={() => navigate('/submit')} id="new-project-btn"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
            <Plus size={16} /> New Project
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={36} className="text-brand-400 animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-white font-bold text-xl mb-2">No Projects Yet</h3>
            <p className="text-gray-400 mb-6">Submit your first project request to get started!</p>
            <button onClick={() => navigate('/submit')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity">
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
