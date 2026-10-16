import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, CheckCircle, Globe, Brain, Smartphone, GraduationCap, Star, Zap, Clock, ThumbsUp } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

const VIEWPORT = { once: true, amount: 0 };

const services = [
  { icon: Globe, title: 'Web Development', desc: 'Full-stack web apps, portfolios, and e-commerce sites.', price: 'Starting ₹499', color: 'bg-blue-50 text-blue-600 border-blue-200/80' },
  { icon: Brain, title: 'AI / ML Projects', desc: 'Machine learning models, NLP, computer vision projects.', price: 'Starting ₹999', color: 'bg-purple-50 text-purple-600 border-purple-200/80' },
  { icon: Smartphone, title: 'Android Apps', desc: 'Native Android apps with Firebase backend.', price: 'Starting ₹799', color: 'bg-emerald-50 text-emerald-600 border-emerald-200/80' },
  { icon: GraduationCap, title: 'Final Year Projects', desc: 'Complete major projects with report, PPT & source code.', price: 'Starting ₹1499', color: 'bg-amber-50 text-amber-600 border-amber-200/80' },
];

const steps = [
  { num: '01', title: 'Submit Your Idea', desc: 'Fill out our simple project request form with your requirements.' },
  { num: '02', title: 'Get a Quote', desc: 'Receive a custom quote within 24 hours from our experts.' },
  { num: '03', title: 'Pay Advance', desc: 'Pay a small advance to confirm your project booking.' },
  { num: '04', title: 'Receive Project', desc: 'Get source code, report & PPT delivered to your email.' },
];

const testimonials = [
  { name: 'Rahul Sharma', college: 'VIT Vellore', text: 'Got my AI project delivered in just 3 days! The code quality was excellent and the team was very responsive.', rating: 5, avatar: 'RS' },
  { name: 'Priya Patel', college: 'NMIMS Mumbai', text: 'Amazing service! My final year project got me an A grade. The documentation provided was thorough and professional.', rating: 5, avatar: 'PP' },
  { name: 'Arjun Nair', college: 'SRM Chennai', text: 'Very affordable pricing and fast delivery. The Android app they built was exactly what I needed. Highly recommend!', rating: 5, avatar: 'AN' },
];

const stats = [
  { icon: ThumbsUp, value: '100+', label: 'Projects Completed' },
  { icon: Clock, value: '24h', label: 'Response Time' },
  { icon: Star, value: '100%', label: 'Satisfaction Rate' },
];

const Home = () => {
  const navigate = useNavigate();
  const { currentUser, openAuthModal } = useAuth();

  const handleProjectSubmitClick = () => {
    if (!currentUser) {
      openAuthModal('login', '/submit');
    } else {
      navigate('/submit');
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-50/70 via-white to-slate-50/50 min-h-screen text-slate-900">

      {/* ===== HERO ===== */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4 pt-20 pb-16">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-sm font-semibold mb-6 shadow-sm">
              <Zap size={14} className="text-amber-500 fill-amber-500" />
              #1 Student Project Platform in India
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-5xl md:text-7xl font-black leading-tight text-slate-900 mb-6 tracking-tight"
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
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Custom-built projects with report, PPT, and source code — all delivered directly to your inbox within 24–72 hours.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={handleProjectSubmitClick}
              id="hero-cta"
              className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg flex items-center justify-center gap-3 shadow-md hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
            >
              Get Started Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/track')}
              className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-lg shadow-sm transition-all duration-300"
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
            className="flex flex-wrap justify-center gap-4 mt-12"
          >
            {['Code + Report + PPT', '100% Original Work', '24-72h Delivery'].map((badge) => (
              <span
                key={badge}
                className="text-xs sm:text-sm text-slate-600 font-medium bg-white px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-sm"
              >
                ✅ {badge}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                custom={i}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center hover:border-blue-300 hover:shadow-md transition-all duration-300 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-3 text-blue-600">
                  <Icon size={22} />
                </div>
                <p className="text-4xl font-black text-slate-900 mb-1">{value}</p>
                <p className="text-slate-500 text-sm font-medium">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Our Services</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">Professional academic projects across all major domains, delivered with full documentation.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(({ icon: Icon, title, desc, price, color }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                custom={i}
                whileHover={{ y: -5 }}
                className="group bg-white border border-slate-200/90 rounded-2xl p-6 hover:border-blue-300 hover:shadow-card-hover transition-all duration-300 cursor-pointer shadow-sm"
                onClick={handleProjectSubmitClick}
              >
                <div className={`w-12 h-12 rounded-xl ${color} border flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{desc}</p>
                <span className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">{price}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 px-4 bg-slate-50/70 border-y border-slate-200/60">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">How It Works</h2>
            <p className="text-slate-600 text-lg">Simple 4-step process to get your project delivered.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ num, title, desc }, i) => (
              <motion.div
                key={num}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                custom={i}
                className="relative text-center"
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-full h-px bg-slate-200" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mx-auto mb-4 text-2xl font-black text-blue-600">
                  {num}
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">What Students Say</h2>
            <p className="text-slate-600 text-lg">Join 100+ students who've already trusted us with their projects.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, college, text, rating, avatar }, i) => (
              <motion.div
                key={name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                custom={i}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 hover:border-blue-200 hover:shadow-md transition-all duration-300 shadow-sm"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(rating)].map((_, j) => <Star key={j} size={14} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-5 italic">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {avatar}
                  </div>
                  <div>
                    <p className="text-slate-900 font-semibold text-sm">{name}</p>
                    <p className="text-slate-500 text-xs">{college}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SUBMIT YOUR PROJECT REQUEST ===== */}
      <section className="py-24 px-4 bg-slate-50/50" id="submit-request">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="text-center mb-14"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold mb-4 shadow-sm">
              🚀 Get Started Today
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              Submit Your{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
                Project Request
              </span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Tell us about your project and get a custom quote within 24 hours. 100% original work with full documentation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left — What you get */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              custom={0}
              className="space-y-4"
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
                  custom={i * 0.1}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-slate-300 hover:shadow transition-all duration-300"
                >
                  <span className="text-2xl flex-shrink-0">{emoji}</span>
                  <div>
                    <p className="text-slate-900 font-semibold text-sm">{title}</p>
                    <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Right — CTA Card */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VIEWPORT} custom={1}>
              <div className="relative bg-white border border-slate-200/90 rounded-3xl p-8 text-center shadow-xl shadow-slate-200/50">
                <div className="w-18 h-18 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-5 p-4 shadow-sm">
                  <span className="text-4xl">🎓</span>
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-2">Ready to Submit?</h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  Join 100+ students who got their projects done professionally. Fill the form and get a quote in minutes.
                </p>

                {/* Pricing preview */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { type: 'Web / App', price: '₹499+' },
                    { type: 'AI / ML', price: '₹999+' },
                    { type: 'Android', price: '₹799+' },
                    { type: 'Final Year', price: '₹1499+' },
                  ].map(({ type, price }) => (
                    <div key={type} className="bg-slate-50 border border-slate-200/70 rounded-xl py-2.5 px-3">
                      <p className="text-slate-500 text-xs">{type}</p>
                      <p className="text-blue-600 font-bold text-sm">{price}</p>
                    </div>
                  ))}
                </div>

                <button
                  id="bottom-cta"
                  onClick={handleProjectSubmitClick}
                  className="group w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-lg flex items-center justify-center gap-3 shadow-md hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 mb-3"
                >
                  Submit Your Project Request
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-slate-400 text-xs">
                  🔒 Secure · Confidential · No spam
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-4 text-center bg-white">
        <p className="text-slate-500 text-sm">
          © 2024 ProBuild · Student Project Assistance Platform · Made with ❤️ by <span className="text-blue-600 font-medium">Shubham Torkad</span>
        </p>
      </footer>
    </div>
  );
};

export default Home;
