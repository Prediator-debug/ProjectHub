import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Input from '../components/Input';
import { getProjectByEmail, updateProjectStatus } from '../services/db';
import { initiatePayment } from '../services/payment';

const StudentTracking = () => {
  const [email, setEmail] = useState('');
  const [projects, setProjects] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const res = await getProjectByEmail(email);
    if (res.success) {
      setProjects(res.data);
    }
    setSearched(true);
    setLoading(false);
  };

  const handlePayment = (project) => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 120000);
    
    initiatePayment({
      project,
      amount: Math.floor(Number(project.budget) * 0.5) || 499,
      onSuccess: async (response) => {
        clearTimeout(timeout);
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        await updateProjectStatus(project.id, { paymentStatus: 'Paid', paymentId: response.razorpay_payment_id });
        setProjects(projects.map(p => p.id === project.id ? { ...p, paymentStatus: 'Paid' } : p));
        setLoading(false);
      },
      onDismiss: () => {
        clearTimeout(timeout);
        setLoading(false);
      }
    });
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Track Your Project Status</h2>
      
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ flex: 1 }}>
          <Input 
            type="email" 
            placeholder="Enter your email address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Track"}
        </Button>
      </form>

      {searched && projects.length === 0 && (
        <p style={{ textAlign: 'center' }}>No requests found for this email.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {projects.map((project, index) => (
          <motion.div 
            key={project.id}
            className="card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>{project.domain} Project</h3>
                <p><strong>Description:</strong> {project.description}</p>
                <p><strong>Requested Budget:</strong> {project.budget}</p>
              </div>
              <div style={{ minWidth: '200px', padding: '1rem', backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <p style={{ marginBottom: '0.5rem' }}><strong>Status:</strong>{' '}
                  <span style={{ color: project.status === 'Completed' ? 'var(--success)' : project.status === 'Accepted' ? 'var(--warning)' : 'var(--text-secondary)' }}>
                    {project.status}
                  </span>
                </p>
                <p style={{ marginBottom: '1rem' }}><strong>Payment:</strong>{' '}
                  <span style={{ color: project.paymentStatus === 'Paid' ? 'var(--success)' : 'var(--warning)' }}>
                    {project.paymentStatus}
                  </span>
                </p>

                {['Accepted', 'In Progress'].includes(project.status) && (project.paymentStatus || 'Pending') !== 'Paid' && (
                   <Button onClick={() => handlePayment(project)} disabled={loading} style={{ width: '100%' }}>Pay Advance</Button>
                )}
                
                {project.status === 'Completed' && (project.paymentStatus || 'Pending') !== 'Paid' && (
                   <Button onClick={() => handlePayment(project)} disabled={loading} style={{ width: '100%', backgroundColor: '#f59e0b', borderColor: '#f59e0b' }}>
                     Unlock Project
                   </Button>
                )}
                
                {project.status === 'Completed' && project.deliveredLink && project.paymentStatus === 'Paid' && (
                  <a href={project.deliveredLink} target="_blank" rel="noreferrer">
                    <Button variant="success" style={{ width: '100%' }}>Download Project</Button>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StudentTracking;
