import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getAllProjects, updateProjectStatus } from '../services/db';
import { CheckCircle, XCircle, Loader2, ExternalLink, RefreshCw, Send } from 'lucide-react';

const STATUS_TABS = ['All', 'Pending', 'Accepted', 'In Progress', 'Completed', 'Rejected'];

const StatusBadge = ({ status }) => {
  const conf = {
    Pending: 'bg-amber-50 border-amber-200/80 text-amber-700',
    Accepted: 'bg-blue-50 border-blue-200/80 text-blue-700',
    'In Progress': 'bg-purple-50 border-purple-200/80 text-purple-700',
    Completed: 'bg-emerald-50 border-emerald-200/80 text-emerald-700',
    Rejected: 'bg-red-50 border-red-200/80 text-red-700',
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50/70 via-white to-slate-50/50 px-4 py-8 text-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1">Logged in as <span className="text-blue-600 font-semibold">{currentUser?.email}</span></p>
          </div>
          <button onClick={fetchProjects} id="admin-refresh"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium shadow-sm transition-all">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'text-slate-900' },
            { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
            { label: 'Active', value: stats.active, color: 'text-blue-600' },
            { label: 'Completed', value: stats.completed, color: 'text-emerald-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white border border-slate-200/90 rounded-2xl p-5 text-center shadow-card">
              <p className={`text-4xl font-black ${color}`}>{value}</p>
              <p className="text-slate-500 text-sm mt-1 font-medium">{label} Projects</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {STATUS_TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}>
              {tab} {tab === 'All' ? `(${projects.length})` : tab === activeTab ? `(${filtered.length})` : ''}
            </button>
          ))}
        </div>

        {/* Projects Table / Cards */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={36} className="text-blue-600 animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200/90 rounded-2xl shadow-sm">
            <p className="text-slate-500">No {activeTab === 'All' ? '' : activeTab} projects found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, idx) => (
                <motion.div key={project.id} layout
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.04 }}
                  className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-slate-300 transition-all shadow-card">
                  
                  <div className="flex flex-wrap gap-4 items-start justify-between">
                    {/* Project Info */}
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-lg">{project.domain} Project</h3>
                        <StatusBadge status={project.status} />
                        <span className={`px-2.5 py-1 rounded-full border text-xs font-semibold ${
                          project.paymentStatus === 'Paid' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'
                        }`}>{project.paymentStatus || 'Pending'}</span>
                      </div>
                      <p className="text-slate-700 text-sm"><span className="text-slate-400">Student:</span> {project.name} · {project.email}</p>
                      <p className="text-slate-600 text-sm"><span className="text-slate-400">College:</span> {project.college}</p>
                      <p className="text-slate-600 text-sm"><span className="text-slate-400">Budget:</span> ₹{project.budget} · <span className="text-slate-400">Deadline:</span> {project.deadline}</p>
                      <p className="text-slate-600 text-sm mt-1 line-clamp-2"><span className="text-slate-400">Desc:</span> {project.description}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[180px]">
                      {project.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button id={`accept-${project.id}`}
                            onClick={() => handleStatusUpdate(project.id, { status: 'Accepted' })}
                            disabled={updating[project.id]}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-all disabled:opacity-50">
                            {updating[project.id] ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />} Accept
                          </button>
                          <button id={`reject-${project.id}`}
                            onClick={() => handleStatusUpdate(project.id, { status: 'Rejected' })}
                            disabled={updating[project.id]}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 text-xs font-semibold transition-all disabled:opacity-50">
                            {updating[project.id] ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />} Reject
                          </button>
                        </div>
                      )}
                      {project.status === 'Accepted' && (
                        <button onClick={() => handleStatusUpdate(project.id, { status: 'In Progress' })}
                          disabled={updating[project.id]}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 text-xs font-semibold transition-all disabled:opacity-50">
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
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all shadow-sm"
                          />
                          <button id={`deliver-${project.id}`}
                            onClick={() => handleDeliver(project.id)}
                            disabled={updating[project.id]}
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition-all disabled:opacity-50">
                            {updating[project.id] ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />} Mark Completed
                          </button>
                        </div>
                      )}
                      {project.status === 'Completed' && project.deliveredLink && (
                        <div className="space-y-2">
                          <a href={project.deliveredLink} target="_blank" rel="noreferrer"
                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-all">
                            <ExternalLink size={13} /> View Delivered
                          </a>
                          <div className={`text-center text-xs font-semibold px-3 py-1.5 rounded-xl border ${
                            project.paymentStatus === 'Paid'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                              : 'bg-amber-50 border-amber-200 text-amber-700'
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
