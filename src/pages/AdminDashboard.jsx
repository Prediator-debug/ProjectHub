import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getAllProjects, updateProjectStatus } from '../services/db';
import { CheckCircle, XCircle, Loader2, ExternalLink, RefreshCw, Filter, Send } from 'lucide-react';

const STATUS_TABS = ['All', 'Pending', 'Accepted', 'In Progress', 'Completed', 'Rejected'];

const StatusBadge = ({ status }) => {
  const conf = {
    Pending: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    Accepted: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    'In Progress': 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    Completed: 'bg-green-500/10 border-green-500/30 text-green-400',
    Rejected: 'bg-red-500/10 border-red-500/30 text-red-400',
  };
  return <span className={`px-2.5 py-1 rounded-full border text-xs font-semibold ${conf[status] || conf.Pending}`}>{status}</span>;
};

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [deliveryLinks, setDeliveryLinks] = useState({});
  const [updating, setUpdating] = useState({});

  const fetchProjects = async () => {
    setLoading(true);
    const res = await getAllProjects();
    if (res.success) setProjects(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleStatusUpdate = async (id, updates) => {
    setUpdating((prev) => ({ ...prev, [id]: true }));
    await updateProjectStatus(id, updates);
    await fetchProjects();
    setUpdating((prev) => ({ ...prev, [id]: false }));
  };

  const handleDeliver = async (id) => {
    const link = deliveryLinks[id];
    if (!link) return alert('Please provide a delivery link first.');
    await handleStatusUpdate(id, { status: 'Completed', deliveredLink: link });
  };

  const filtered = activeTab === 'All' ? projects : projects.filter(p => p.status === activeTab);

  const stats = {
    total: projects.length,
    pending: projects.filter(p => p.status === 'Pending').length,
    active: projects.filter(p => ['Accepted', 'In Progress'].includes(p.status)).length,
    completed: projects.filter(p => p.status === 'Completed').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Logged in as <span className="text-brand-400">{currentUser?.email}</span></p>
          </div>
          <button onClick={fetchProjects} id="admin-refresh"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-sm transition-all">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'text-white', grad: 'from-brand-600/20 to-purple-600/20', border: 'border-brand-500/20' },
            { label: 'Pending', value: stats.pending, color: 'text-yellow-400', grad: 'from-yellow-600/10 to-orange-600/10', border: 'border-yellow-500/20' },
            { label: 'Active', value: stats.active, color: 'text-blue-400', grad: 'from-blue-600/10 to-cyan-600/10', border: 'border-blue-500/20' },
            { label: 'Completed', value: stats.completed, color: 'text-green-400', grad: 'from-green-600/10 to-emerald-600/10', border: 'border-green-500/20' },
          ].map(({ label, value, color, grad, border }) => (
            <div key={label} className={`bg-gradient-to-br ${grad} border ${border} rounded-2xl p-5 text-center`}>
              <p className={`text-4xl font-black ${color}`}>{value}</p>
              <p className="text-gray-500 text-sm mt-1">{label} Projects</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {STATUS_TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-brand-600 to-purple-600 text-white shadow-glow'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
              }`}>
              {tab} {tab === 'All' ? `(${projects.length})` : tab === activeTab ? `(${filtered.length})` : ''}
            </button>
          ))}
        </div>

        {/* Projects Table / Cards */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={36} className="text-brand-400 animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-gray-400">No {activeTab === 'All' ? '' : activeTab} projects found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, idx) => (
                <motion.div key={project.id} layout
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.04 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:border-brand-500/20 transition-all">
                  
                  <div className="flex flex-wrap gap-4 items-start justify-between">
                    {/* Project Info */}
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-bold text-white text-lg">{project.domain} Project</h3>
                        <StatusBadge status={project.status} />
                        <span className={`px-2.5 py-1 rounded-full border text-xs font-semibold ${
                          project.paymentStatus === 'Paid' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                        }`}>{project.paymentStatus}</span>
                      </div>
                      <p className="text-gray-300 text-sm"><span className="text-gray-500">Student:</span> {project.name} · {project.email}</p>
                      <p className="text-gray-400 text-sm"><span className="text-gray-500">College:</span> {project.college}</p>
                      <p className="text-gray-400 text-sm"><span className="text-gray-500">Budget:</span> ₹{project.budget} · <span className="text-gray-500">Deadline:</span> {project.deadline}</p>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2"><span className="text-gray-500">Desc:</span> {project.description}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[180px]">
                      {project.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button id={`accept-${project.id}`}
                            onClick={() => handleStatusUpdate(project.id, { status: 'Accepted' })}
                            disabled={updating[project.id]}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 text-xs font-semibold transition-all disabled:opacity-50">
                            {updating[project.id] ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />} Accept
                          </button>
                          <button id={`reject-${project.id}`}
                            onClick={() => handleStatusUpdate(project.id, { status: 'Rejected' })}
                            disabled={updating[project.id]}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-all disabled:opacity-50">
                            {updating[project.id] ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />} Reject
                          </button>
                        </div>
                      )}
                      {project.status === 'Accepted' && (
                        <button onClick={() => handleStatusUpdate(project.id, { status: 'In Progress' })}
                          disabled={updating[project.id]}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 text-xs font-semibold transition-all disabled:opacity-50">
                          Mark In Progress
                        </button>
                      )}
                      {project.status === 'In Progress' && (
                        <div className="space-y-2">
                          <input
                            type="url"
                            placeholder="Google Drive link..."
                            value={deliveryLinks[project.id] || ''}
                            onChange={(e) => setDeliveryLinks({ ...deliveryLinks, [project.id]: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-all"
                          />
                          <button id={`deliver-${project.id}`}
                            onClick={() => handleDeliver(project.id)}
                            disabled={updating[project.id]}
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 text-xs font-semibold transition-all disabled:opacity-50">
                            {updating[project.id] ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />} Mark Completed
                          </button>
                        </div>
                      )}
                      {project.status === 'Completed' && project.deliveredLink && (
                        <div className="space-y-2">
                          <a href={project.deliveredLink} target="_blank" rel="noreferrer"
                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold hover:bg-green-500/20 transition-all">
                            <ExternalLink size={13} /> View Delivered
                          </a>
                          <div className={`text-center text-xs font-semibold px-3 py-1.5 rounded-xl border ${
                            project.paymentStatus === 'Paid'
                              ? 'bg-green-500/10 border-green-500/30 text-green-400'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          }`}>
                            {project.paymentStatus === 'Paid' ? '✅ Payment Received' : '⏳ Awaiting Payment'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
