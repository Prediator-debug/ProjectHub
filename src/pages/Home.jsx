import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Globe, Brain, Smartphone, GraduationCap, Star, Zap, Clock, ThumbsUp } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

const VIEWPORT = { once: true, amount: 0 };


const services = [
  { icon: Globe, title: 'Web Development', desc: 'Full-stack web apps, portfolios, and e-commerce sites.', price: 'Starting ₹499', color: 'from-blue-500 to-cyan-500' },
  { icon: Brain, title: 'AI / ML Projects', desc: 'Machine learning models, NLP, computer vision projects.', price: 'Starting ₹999', color: 'from-purple-500 to-pink-500' },
  { icon: Smartphone, title: 'Android Apps', desc: 'Native Android apps with Firebase backend.', price: 'Starting ₹799', color: 'from-green-500 to-emerald-500' },
  { icon: GraduationCap, title: 'Final Year Projects', desc: 'Complete major projects with report, PPT & source code.', price: 'Starting ₹1499', color: 'from-orange-500 to-red-500' },
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

  return (
    <div className="bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 min-h-screen text-white">

      {/* ===== HERO ===== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4 pt-24">
        {/* Background orbs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-brand-600/25 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-purple-600/25 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-900/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-6">
              <Zap size={14} className="text-yellow-400" />
              #1 Student Project Platform in India
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Get Industry-Level<br />
            <span className="bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              College Projects
            </span>
            <br />Delivered Fast
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Custom-built projects with report, PPT, and source code — all delivered directly to your inbox within 24–72 hours.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/submit')} id="hero-cta"
              className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-lg flex items-center justify-center gap-3 shadow-glow hover:shadow-glow-lg transition-all duration-300">
              Get Started Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => navigate('/track')}
              className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold text-lg transition-all duration-300">
              Track My Project
            </button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="flex flex-wrap justify-center gap-6 mt-12">
            {['✅ Code + Report + PPT', '🔒 100% Original Work', '⚡ 24-72h Delivery'].map((badge) => (
              <span key={badge} className="text-sm text-gray-400 font-medium">{badge}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <motion.div key={label} variants={fadeUp} initial="hidden" whileInView="visible" viewport={VIEWPORT} custom={i}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:border-brand-500/30 hover:shadow-glow transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 border border-brand-500/20 flex items-center justify-center mx-auto mb-3">
                  <Icon size={22} className="text-brand-400" />
                </div>
                <p className="text-4xl font-black text-white mb-1">{value}</p>
                <p className="text-gray-400 text-sm">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VIEWPORT}
            className="text-center mb-14">
            <h2 className="text-4xl font-black text-white mb-4">Our Services</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Professional academic projects across all major domains, delivered with full documentation.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(({ icon: Icon, title, desc, price, color }, i) => (
              <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={VIEWPORT} custom={i}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:shadow-card transition-all duration-300 cursor-pointer"
                onClick={() => navigate('/submit')}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-glow group-hover:scale-110 transition-transform`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{desc}</p>
                <span className="inline-block px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold">{price}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 px-4 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VIEWPORT}
            className="text-center mb-14">
            <h2 className="text-4xl font-black text-white mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Simple 4-step process to get your project delivered.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ num, title, desc }, i) => (
              <motion.div key={num} variants={fadeUp} initial="hidden" whileInView="visible" viewport={VIEWPORT} custom={i}
                className="relative text-center">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-full h-px bg-gradient-to-r from-brand-500/30 to-transparent" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center mx-auto mb-4 text-2xl font-black text-white shadow-glow">
                  {num}
                </div>
                <h3 className="font-bold text-white text-base mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VIEWPORT}
            className="text-center mb-14">
            <h2 className="text-4xl font-black text-white mb-4">What Students Say</h2>
            <p className="text-gray-400 text-lg">Join 100+ students who've already trusted us with their projects.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, college, text, rating, avatar }, i) => (
              <motion.div key={name} variants={fadeUp} initial="hidden" whileInView="visible" viewport={VIEWPORT} custom={i}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-brand-500/20 hover:shadow-glow transition-all duration-300">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(rating)].map((_, j) => <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{name}</p>
                    <p className="text-gray-500 text-xs">{college}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SUBMIT YOUR PROJECT REQUEST ===== */}
      <section className="py-24 px-4" id="submit-request">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VIEWPORT}
            className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-4">
              🚀 Get Started Today
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Submit Your{' '}
              <span className="bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Project Request
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Tell us about your project and get a custom quote within 24 hours. 100% original work with full documentation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left — What you get */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VIEWPORT} custom={0}
              className="space-y-4">
              {[
                { emoji: '📦', title: 'Complete Source Code', desc: 'Clean, commented, and well-structured code ready to run.' },
                { emoji: '📄', title: 'Project Report (PDF)', desc: 'Detailed documentation with abstract, methodology & references.' },
                { emoji: '🎨', title: 'PPT Presentation', desc: 'Professional slides ready for your project viva.' },
                { emoji: '⚡', title: '24–72 Hour Delivery', desc: 'Fast turnaround without compromising on quality.' },
                { emoji: '🔄', title: 'Free Revisions', desc: 'Not satisfied? We revise till you\'re happy.' },
                { emoji: '🔒', title: '100% Confidential', desc: 'Your project details are never shared with anyone.' },
              ].map(({ emoji, title, desc }, i) => (
                <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={VIEWPORT} custom={i * 0.1}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-brand-500/20 hover:bg-white/[0.05] transition-all duration-300">
                  <span className="text-2xl flex-shrink-0">{emoji}</span>
                  <div>
                    <p className="text-white font-semibold text-sm">{title}</p>
                    <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Right — CTA Card */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VIEWPORT} custom={1}>
              <div className="relative">
                {/* Glow behind card */}
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-purple-600 rounded-3xl blur-xl opacity-25 animate-pulse-slow" />

                <div className="relative bg-gradient-to-br from-dark-700 to-dark-800 border border-white/10 rounded-3xl p-8 text-center shadow-card">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-glow">
                    <span className="text-4xl">🎓</span>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-2">Ready to Submit?</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
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
                      <div key={type} className="bg-white/5 border border-white/10 rounded-xl py-2.5 px-3">
                        <p className="text-gray-400 text-xs">{type}</p>
                        <p className="text-brand-400 font-bold text-sm">{price}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    id="bottom-cta"
                    onClick={() => navigate('/submit')}
                    className="group w-full py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-400 hover:to-purple-500 text-white font-black text-lg flex items-center justify-center gap-3 shadow-glow hover:shadow-glow-lg transition-all duration-300 mb-3"
                  >
                    Submit Your Project Request
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <p className="text-gray-600 text-xs">
                    🔒 Secure · Confidential · No spam
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 text-center">
        <p className="text-gray-500 text-sm">
          © 2024 ProBuild · Student Project Assistance Platform · Made with ❤️ by <span className="text-brand-400">Shubham Torkad</span>
        </p>
      </footer>
    </div>
  );
};

export default Home;
