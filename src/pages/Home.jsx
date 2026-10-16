import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, CheckCircle, Globe, Brain, Smartphone, GraduationCap, Star, Zap, Clock, ThumbsUp, PenSquare, X, Check } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.08 } }),
};

const VIEWPORT = { once: true, amount: 0 };

const services = [
  { icon: Globe, title: 'Web Development', desc: 'Full-stack web apps, portfolios, and e-commerce sites.', price: 'Starting ₹499', color: 'bg-blue-50 text-blue-600 border-blue-200/80 dark:bg-[#0a1628] dark:text-[#4f8ef7] dark:border-[#1c3a6e]' },
  { icon: Brain, title: 'AI / ML Projects', desc: 'Machine learning models, NLP, computer vision projects.', price: 'Starting ₹999', color: 'bg-purple-50 text-purple-600 border-purple-200/80 dark:bg-[#130a28] dark:text-purple-400 dark:border-[#2a1060]' },
  { icon: Smartphone, title: 'Android Apps', desc: 'Native Android apps with Firebase backend.', price: 'Starting ₹799', color: 'bg-emerald-50 text-emerald-600 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/80' },
  { icon: GraduationCap, title: 'Final Year Projects', desc: 'Complete major projects with report, PPT & source code.', price: 'Starting ₹1499', color: 'bg-amber-50 text-amber-600 border-amber-200/80 dark:bg-[#1a1000] dark:text-amber-400 dark:border-[#3d2800]' },
];

const steps = [
  { num: '01', title: 'Submit Your Idea', desc: 'Fill out our simple project request form with your requirements.' },
  { num: '02', title: 'Get a Quote', desc: 'Receive a custom quote within 24 hours from our experts.' },
  { num: '03', title: 'Pay Advance', desc: 'Pay a small advance to confirm your project booking.' },
  { num: '04', title: 'Receive Project', desc: 'Get source code, report & PPT delivered to your email.' },
];

const defaultTestimonials = [
  {
    name: 'Darshan Jadhav',
    college: 'Parikrama College of Engineering',
    text: 'Got my Machine Learning project delivered in just 3 days! The code quality was clean, PPT and report were thoroughly prepared, and the team cleared all my viva doubts.',
    rating: 5,
    avatar: 'DJ',
  },
  {
    name: 'Ganesh Choudhari',
    college: "Sanjivani Rural Education Society's Sanjivani College of Engineering, Kopargaon",
    text: 'Outstanding support for our Final Year major project. Full stack system with Razorpay integration and clean documentation. Delivered on time and helped us get an A+ grade!',
    rating: 5,
    avatar: 'GC',
  },
  {
    name: 'Saurabh Patil',
    college: 'D.Y. Patil College of Engineering, Akurdi',
    text: 'Best project guidance for Pune university students! They delivered our complete Android application along with synopsis and deployment support. Highly recommended!',
    rating: 5,
    avatar: 'SP',
  },
];

const stats = [
  { icon: ThumbsUp, value: '50+', label: 'Projects Completed' },
  { icon: Clock, value: '24h', label: 'Response Time' },
  { icon: Star, value: '100%', label: 'Satisfaction Rate' },
];

const Home = () => {
  const navigate = useNavigate();
  const { currentUser, openAuthModal } = useAuth();

  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('probuild_user_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return defaultTestimonials;
  });

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    name: currentUser?.displayName || '',
    college: '',
    text: '',
    rating: 5,
  });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const handleProjectSubmitClick = () => {
    if (!currentUser) {
      openAuthModal('login', '/submit');
    } else {
      navigate('/submit');
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name.trim()) {
      setReviewError('Please enter your full name');
      return;
    }
    if (!newReview.college.trim()) {
      setReviewError('Please enter your college name');
      return;
    }
    if (!newReview.text.trim()) {
      setReviewError('Please write your review feedback');
      return;
    }

    const words = newReview.name.trim().split(' ').filter(Boolean);
    const initials = words.length >= 2
      ? (words[0][0] + words[1][0]).toUpperCase()
      : words[0].slice(0, 2).toUpperCase();

    const createdReview = {
      name: newReview.name.trim(),
      college: newReview.college.trim(),
      text: newReview.text.trim(),
      rating: Number(newReview.rating) || 5,
      avatar: initials || 'ST',
      id: Date.now(),
    };

    const updated = [createdReview, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem('probuild_user_reviews', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setReviewModalOpen(false);
      setNewReview({ name: currentUser?.displayName || '', college: '', text: '', rating: 5 });
      setReviewError('');
    }, 1500);
  };

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-100 overflow-x-hidden bg-transparent">

      {/* ===== HERO ===== */}
      <section className="relative z-10 min-h-[80vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden px-4 pt-16 sm:pt-20 pb-12 sm:pb-16">
        <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-blue-50/90 dark:bg-[#0a1628] backdrop-blur-sm border border-blue-200/80 dark:border-[#1c3a6e] text-blue-700 dark:text-[#4f8ef7] text-xs sm:text-sm font-semibold mb-5 sm:mb-6 shadow-sm">
              <Zap size={14} className="text-amber-500 fill-amber-500" />
              #1 Student Project Platform in India
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.15] text-slate-900 dark:text-[#e8edf5] mb-5 sm:mb-6 tracking-tight px-1"
          >
            Get Industry-Level<br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              College Projects
            </span>
            <br />Delivered Fast
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-sm sm:text-lg md:text-xl text-slate-600 dark:text-[#8b9ab4] max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2"
          >
            Custom-built projects with report, PPT, and source code — all delivered directly to your inbox within 24–72 hours.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-xs sm:max-w-none mx-auto w-full"
          >
            <button
              onClick={handleProjectSubmitClick}
              id="hero-cta"
              className="group w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 sm:gap-3 shadow-md hover:shadow-lg shadow-blue-500/20 transition-all duration-300"
            >
              Get Started Now
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/track')}
              className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-[#0d1117] backdrop-blur-sm hover:bg-white dark:hover:bg-[#111827] border border-slate-200 dark:border-[#1c2a3e] text-slate-700 dark:text-[#e8edf5] font-semibold text-base sm:text-lg shadow-sm transition-all duration-300"
            >
              Track My Project
            </button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-8 sm:mt-12"
          >
            {['Code + Report + PPT', '100% Original Work', '24-72h Delivery'].map((badge) => (
              <span
                key={badge}
                className="text-xs sm:text-sm text-slate-600 dark:text-[#8b9ab4] font-medium bg-white/90 dark:bg-[#0d1117] backdrop-blur-sm px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-slate-200/80 dark:border-[#1c2a3e] shadow-sm"
              >
                ✅ {badge}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="relative z-10 py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-6">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                custom={i}
                className="bg-white/95 dark:bg-[#0d1117] backdrop-blur-xl border border-slate-200/90 dark:border-[#1c2a3e] rounded-2xl p-5 sm:p-6 text-center hover:border-blue-400 dark:hover:border-[#2a4a6e] hover:shadow-lg transition-all duration-300 shadow-sm"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-50/90 dark:bg-[#0a1628] border border-blue-100 dark:border-[#1c3a6e] flex items-center justify-center mx-auto mb-2.5 sm:mb-3 text-blue-600 dark:text-[#4f8ef7]">
                  <Icon size={20} />
                </div>
                <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-[#e8edf5] mb-0.5 sm:mb-1">{value}</p>
                <p className="text-slate-500 dark:text-[#8b9ab4] text-xs sm:text-sm font-medium">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="relative z-10 py-14 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="text-center mb-10 sm:mb-14"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 sm:mb-4 tracking-tight">Our Services</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto px-2">Professional academic projects across all major domains, delivered with full documentation.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {services.map(({ icon: Icon, title, desc, price, color }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                custom={i}
                whileHover={{ y: -4 }}
                className="group bg-white/95 dark:bg-[#0d1117] backdrop-blur-xl border border-slate-200/90 dark:border-[#1c2a3e] rounded-2xl p-5 sm:p-6 hover:border-blue-400 dark:hover:border-[#2a4a6e] hover:shadow-lg transition-all duration-300 cursor-pointer shadow-sm"
                onClick={handleProjectSubmitClick}
              >
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${color} border flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-[#e8edf5] text-base sm:text-lg mb-1.5 sm:mb-2">{title}</h3>
                <p className="text-slate-600 dark:text-[#8b9ab4] text-xs sm:text-sm leading-relaxed mb-4">{desc}</p>
                <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-[#0a1628] border border-blue-200 dark:border-[#1c3a6e] text-blue-700 dark:text-[#4f8ef7] text-xs font-bold">{price}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative z-10 py-14 sm:py-20 px-4 border-y border-slate-200/60 dark:border-slate-800/80">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="text-center mb-10 sm:mb-14"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 sm:mb-4 tracking-tight">How It Works</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-lg">Simple 4-step process to get your project delivered.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {steps.map(({ num, title, desc }, i) => (
              <motion.div
                key={num}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                custom={i}
                className="relative text-center bg-white/95 dark:bg-[#0d1117] backdrop-blur-xl sm:bg-transparent dark:sm:bg-transparent p-5 sm:p-0 rounded-2xl sm:rounded-none border sm:border-none border-slate-200/70 dark:border-[#1c2a3e] shadow-sm sm:shadow-none"
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-full h-px bg-slate-200 dark:bg-slate-700" />
                )}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/95 dark:bg-[#0d1117] backdrop-blur-xl border border-slate-200 dark:border-[#1c2a3e] shadow-sm flex items-center justify-center mx-auto mb-3.5 sm:mb-4 text-xl sm:text-2xl font-black text-blue-600 dark:text-[#4f8ef7]">
                  {num}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-[#e8edf5] text-sm sm:text-base mb-1.5 sm:mb-2">{title}</h3>
                <p className="text-slate-600 dark:text-[#8b9ab4] text-xs sm:text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="relative z-10 py-14 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="text-center mb-10 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 sm:mb-4 tracking-tight">What Students Say</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-lg mb-4 sm:mb-5">Join 50+ students who've already trusted us with their projects.</p>

            <button
              id="write-review-btn"
              onClick={() => {
                setReviewError('');
                setReviewSubmitted(false);
                setReviewModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/90 dark:bg-[#0d1117] backdrop-blur-sm border border-slate-200 dark:border-[#1c2a3e] hover:border-blue-500 dark:hover:border-[#2a4a6e] text-slate-800 dark:text-[#e8edf5] hover:text-blue-600 dark:hover:text-[#4f8ef7] text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
            >
              <PenSquare size={16} className="text-blue-600 dark:text-blue-400" />
              Write a Review
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {reviews.map(({ name, college, text, rating, avatar }, i) => (
              <motion.div
                key={name + i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                custom={i}
                className="bg-white/95 dark:bg-[#0d1117] backdrop-blur-xl border border-slate-200/90 dark:border-[#1c2a3e] rounded-2xl p-5 sm:p-6 hover:border-blue-300 dark:hover:border-[#2a4a6e] hover:shadow-md transition-all duration-300 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-0.5 mb-3 sm:mb-4">
                    {[...Array(rating || 5)].map((_, j) => <Star key={j} size={14} className="text-amber-400 fill-amber-400" />)}
                  </div>
                  <p className="text-slate-700 dark:text-[#c5d0e0] text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5 italic">"{text}"</p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-[#1c2a3e] mt-auto">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                    {avatar || name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-900 dark:text-[#e8edf5] font-semibold text-xs sm:text-sm truncate">{name}</p>
                    <p className="text-slate-500 dark:text-[#8b9ab4] text-[11px] sm:text-xs line-clamp-1">{college}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SUBMIT YOUR PROJECT REQUEST ===== */}
      <section className="relative z-10 py-16 sm:py-24 px-4" id="submit-request">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="text-center mb-10 sm:mb-14"
          >
            <span className="inline-block px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold mb-3 sm:mb-4 shadow-sm">
              🚀 Get Started Today
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-3 sm:mb-4 tracking-tight px-1">
              Submit Your{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
                Project Request
              </span>
            </h2>
            <p className="text-slate-600 dark:text-[#8b9ab4] text-sm sm:text-lg max-w-2xl mx-auto px-2">
              Tell us about your project and get a custom quote within 24 hours. 100% original work with full documentation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            {/* Left — What you get */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              custom={0}
              className="space-y-3 sm:space-y-4"
            >
              {[
                { emoji: '📦', title: 'Complete Source Code', desc: 'Clean, commented, and well-structured code ready to run.' },
                { emoji: '📄', title: 'Project Report (PDF)', desc: 'Detailed documentation with abstract, methodology & references.' },
                { emoji: '🎨', title: 'PPT Presentation', desc: 'Professional slides ready for your project viva.' },
                { emoji: '⚡', title: '24–72 Hour Delivery', desc: 'Fast turnaround without compromising on quality.' },
                { emoji: '🔄', title: 'Free Revisions', desc: 'Not satisfied? We revise till you\'re happy.' },
                { emoji: '🔒', title: '100% Confidential', desc: 'Your project details are never shared with anyone.' },
              ].map(({ emoji, title, desc }, i) => (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={VIEWPORT}
                  custom={i * 0.08}
                  className="flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/95 dark:bg-[#0d1117] backdrop-blur-xl border border-slate-200/80 dark:border-[#1c2a3e] shadow-sm hover:border-slate-300 dark:hover:border-[#2a4a6e] transition-all duration-300"
                >
                  <span className="text-xl sm:text-2xl flex-shrink-0">{emoji}</span>
                  <div>
                    <p className="text-slate-900 dark:text-[#e8edf5] font-semibold text-xs sm:text-sm">{title}</p>
                    <p className="text-slate-500 dark:text-[#8b9ab4] text-[11px] sm:text-xs mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Right — CTA Card */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VIEWPORT} custom={1}>
              <div className="relative bg-white/95 dark:bg-[#0d1117] backdrop-blur-xl border border-slate-200/90 dark:border-[#1c2a3e] rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-center shadow-xl shadow-slate-200/40 dark:shadow-[0_8px_40px_rgba(0,0,0,0.7)]">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-blue-50 dark:bg-[#0a1628] border border-blue-100 dark:border-[#1c3a6e] flex items-center justify-center mx-auto mb-4 sm:mb-5 p-3.5 shadow-sm">
                  <span className="text-3xl sm:text-4xl">🎓</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#e8edf5] mb-1.5 sm:mb-2">Ready to Submit?</h3>
                <p className="text-slate-600 dark:text-[#8b9ab4] text-xs sm:text-sm mb-5 sm:mb-6 leading-relaxed max-w-sm mx-auto">
                  Join 50+ students who got their projects done professionally. Fill the form and get a quote in minutes.
                </p>

                {/* Pricing preview */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-5 sm:mb-6">
                  {[
                    { type: 'Web / App', price: '₹499+' },
                    { type: 'AI / ML', price: '₹999+' },
                    { type: 'Android', price: '₹799+' },
                    { type: 'Final Year', price: '₹1499+' },
                  ].map(({ type, price }) => (
                    <div key={type} className="bg-slate-50 dark:bg-[#111827] border border-slate-200/70 dark:border-[#1c2a3e] rounded-xl py-2 px-2.5 sm:py-2.5 sm:px-3">
                      <p className="text-slate-500 dark:text-[#8b9ab4] text-[11px] sm:text-xs">{type}</p>
                      <p className="text-blue-600 dark:text-[#4f8ef7] font-bold text-xs sm:text-sm">{price}</p>
                    </div>
                  ))}
                </div>

                <button
                  id="bottom-cta"
                  onClick={handleProjectSubmitClick}
                  className="group w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 sm:gap-3 shadow-md hover:shadow-lg shadow-blue-500/20 transition-all duration-300 mb-2.5"
                >
                  Submit Your Project Request
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-slate-400 dark:text-slate-500 text-[11px] sm:text-xs">
                  🔒 Secure · Confidential · No spam
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/80 dark:border-[#1c2a3e] py-6 sm:py-8 px-4 text-center bg-white/80 dark:bg-[#05070f]/90 backdrop-blur-md transition-colors duration-200">
        <p className="text-slate-500 dark:text-[#8b9ab4] text-xs sm:text-sm">
          © 2024 ProBuild · Student Project Assistance Platform · Made with ❤️ by <span className="text-blue-600 dark:text-[#4f8ef7] font-medium">Shubham Torkad</span>
        </p>
      </footer>

      {/* ===== REVIEW SUBMIT MODAL ===== */}
      <AnimatePresence>
        {reviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReviewModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 dark:bg-[#000]/85 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-[#1c2a3e] rounded-3xl p-6 sm:p-8 shadow-2xl dark:shadow-[0_8px_40px_rgba(0,0,0,0.8)] z-10 my-8 max-h-[92vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setReviewModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              {reviewSubmitted ? (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-[#071a10] border border-emerald-200 dark:border-[#0d3a20] text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4"
                  >
                    <Check size={32} />
                  </motion.div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-[#e8edf5] mb-1.5">Review Submitted!</h3>
                  <p className="text-slate-600 dark:text-[#8b9ab4] text-sm">Thank you for sharing your experience. Your review is now live!</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-[#0a1628] border border-blue-200/80 dark:border-[#1c3a6e] flex items-center justify-center text-blue-600 dark:text-[#4f8ef7] flex-shrink-0">
                      <PenSquare size={20} />
                    </div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-[#e8edf5]">Share Your Review</h3>
                    <p className="text-slate-500 dark:text-[#8b9ab4] text-xs">Help other students know about our service</p>
                    </div>
                  </div>

                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    {/* Star Rating Picker */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-[#8b9ab4] uppercase tracking-wider mb-2">
                        Your Rating
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              size={26}
                              className={
                                star <= newReview.rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-300 dark:text-slate-700'
                              }
                            />
                          </button>
                        ))}
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-2">
                          {newReview.rating} of 5 Stars
                        </span>
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-[#8b9ab4] uppercase tracking-wider mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Darshan Jadhav"
                        value={newReview.name}
                        onChange={(e) => {
                          setNewReview({ ...newReview, name: e.target.value });
                          setReviewError('');
                        }}
                        className="w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1c2a3e] rounded-xl px-4 py-2.5 text-slate-900 dark:text-[#e8edf5] placeholder-slate-400 dark:placeholder-[#4a5a72] text-base sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                      />
                    </div>

                    {/* College */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-[#8b9ab4] uppercase tracking-wider mb-1.5">
                        College / University
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Parikrama College of Engineering"
                        value={newReview.college}
                        onChange={(e) => {
                          setNewReview({ ...newReview, college: e.target.value });
                          setReviewError('');
                        }}
                        className="w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1c2a3e] rounded-xl px-4 py-2.5 text-slate-900 dark:text-[#e8edf5] placeholder-slate-400 dark:placeholder-[#4a5a72] text-base sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                      />
                    </div>

                    {/* Review text */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-[#8b9ab4] uppercase tracking-wider mb-1.5">
                        Review / Feedback
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Tell us about the project quality, delivery speed, and overall experience..."
                        value={newReview.text}
                        onChange={(e) => {
                          setNewReview({ ...newReview, text: e.target.value });
                          setReviewError('');
                        }}
                      className="w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1c2a3e] rounded-xl px-4 py-2.5 text-slate-900 dark:text-[#e8edf5] placeholder-slate-400 dark:placeholder-[#4a5a72] text-base sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm resize-none"
                      />
                    </div>

                    {reviewError && (
                      <p className="text-red-500 text-xs font-medium">{reviewError}</p>
                    )}

                    <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => setReviewModalOpen(false)}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-[#1c2a3e] text-slate-700 dark:text-[#8b9ab4] hover:bg-slate-50 dark:hover:bg-[#111827] font-semibold text-sm transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all"
                      >
                        Submit Review
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
