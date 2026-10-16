import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { submitProjectRequest } from '../services/db';
import { Send, CheckCircle, User, Mail, Building2, Layers, FileText, Calendar, IndianRupee } from 'lucide-react';

const DOMAINS = [
  { value: 'Web Dev', label: '🌐 Web Development' },
  { value: 'AI', label: '🧠 Artificial Intelligence' },
  { value: 'ML', label: '📊 Machine Learning' },
  { value: 'Android', label: '📱 Android App' },
  { value: 'IoT', label: '🔌 Internet of Things' },
  { value: 'Blockchain', label: '⛓️ Blockchain' },
  { value: 'Cybersecurity', label: '🔐 Cybersecurity' },
  { value: 'Data Science', label: '📈 Data Science' },
  { value: 'Final Year', label: '🎓 Final Year Major Project' },
  { value: 'Other', label: '📦 Other' },
];

const Field = ({ label, icon: Icon, children, error }) => (
  <div>
    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
      {Icon && <Icon size={14} className="text-slate-400" />} {label}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
  </div>
);

const inputCls = "w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 text-base sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm";

const SubmitForm = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    college: '',
    domain: 'Web Dev',
    description: '',
    deadline: '',
    budget: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Name is required';
    if (!formData.email.trim()) e.email = 'Email is required';
    if (!formData.college.trim()) e.college = 'College name is required';
    if (!formData.description.trim()) e.description = 'Description is required';
    else if (formData.description.length < 20) e.description = 'Please provide more detail (min 20 chars)';
    if (!formData.deadline) e.deadline = 'Deadline is required';
    if (!formData.budget || Number(formData.budget) < 1) e.budget = 'Valid budget is required';
    return e;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    const res = await submitProjectRequest({ ...formData, userId: currentUser?.uid });
    setLoading(false);
    if (res.success) {
      setSubmitted(true);
    } else {
      setErrors({ submit: 'Failed to submit. Please try again.' });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center px-4 text-slate-900 dark:text-slate-100">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center bg-white/85 dark:bg-slate-800/85 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/80 rounded-3xl p-10 shadow-xl">
          <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Project Submitted!</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">Your project request has been received. You'll hear from us within 24 hours.</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/dashboard')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-md transition-all">
              View My Dashboard
            </button>
            <button onClick={() => { setSubmitted(false); setFormData({ name: currentUser?.displayName || '', email: currentUser?.email || '', college: '', domain: 'Web Dev', description: '', deadline: '', budget: '' }); }}
              className="w-full py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-all">
              Submit Another
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent px-4 py-8 sm:py-10 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/85 dark:bg-slate-800/85 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/80 rounded-3xl p-5 sm:p-8 shadow-card">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Submit Project Request</h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm mb-7">Fill in the details below and get a quote within 24 hours.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Full Name" icon={User} error={errors.name}>
                <input id="form-name" name="name" type="text" placeholder="Your full name" value={formData.name} onChange={handleChange} className={`${inputCls} ${errors.name ? 'border-red-400' : ''}`} />
              </Field>
              <Field label="Email" icon={Mail} error={errors.email}>
                <input id="form-email" name="email" type="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} className={`${inputCls} ${errors.email ? 'border-red-400' : ''}`} />
              </Field>
            </div>

            <Field label="College / University" icon={Building2} error={errors.college}>
              <input id="form-college" name="college" type="text" placeholder="e.g., VIT Vellore, NMIMS Mumbai" value={formData.college} onChange={handleChange} className={`${inputCls} ${errors.college ? 'border-red-400' : ''}`} />
            </Field>

            <Field label="Project Domain" icon={Layers}>
              <select id="form-domain" name="domain" value={formData.domain} onChange={handleChange} className={`${inputCls} bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}>
                {DOMAINS.map(d => <option key={d.value} value={d.value} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{d.label}</option>)}
              </select>
            </Field>

            <Field label="Project Description" icon={FileText} error={errors.description}>
              <div className="relative">
                <textarea id="form-description" name="description" placeholder="Describe your project requirements in detail — topics, features, language preference, references, etc." value={formData.description} onChange={handleChange} rows={4}
                  className={`${inputCls} resize-none ${errors.description ? 'border-red-400' : ''}`} />
                <span className="absolute bottom-2.5 right-3 text-xs text-slate-400">{formData.description.length}/500</span>
              </div>
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Deadline" icon={Calendar} error={errors.deadline}>
                <input id="form-deadline" name="deadline" type="date" value={formData.deadline} onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`${inputCls} ${errors.deadline ? 'border-red-400' : ''}`} />
              </Field>
              <Field label="Budget (₹)" icon={IndianRupee} error={errors.budget}>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                  <input id="form-budget" name="budget" type="number" min="0" placeholder="e.g., 999" value={formData.budget} onChange={handleChange}
                    className={`${inputCls} pl-8 ${errors.budget ? 'border-red-400' : ''}`} />
                </div>
              </Field>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">{errors.submit}</div>
            )}

            <button id="form-submit" type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg shadow-blue-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Send size={18} /> Submit Project Request</>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SubmitForm;
