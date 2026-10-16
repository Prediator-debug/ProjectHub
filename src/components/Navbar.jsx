import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, FileText, Home, Shield, Menu, X, Clock, LogIn } from 'lucide-react';

const Navbar = () => {
  const { currentUser, isAdmin, logout, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (!currentUser) {
      openAuthModal('login', '/submit');
    } else {
      navigate('/submit');
    }
  };

  const navLinks = isAdmin
    ? [
        { to: '/', icon: Home, label: 'Home' },
        { to: '/admin', icon: Shield, label: 'Dashboard' },
      ]
    : currentUser
    ? [
        { to: '/', icon: Home, label: 'Home' },
        { to: '/submit', icon: FileText, label: 'Submit Project' },
        { to: '/dashboard', icon: LayoutDashboard, label: 'My Projects' },
        { to: '/track', icon: Clock, label: 'Track' },
      ]
    : [
        { to: '/', icon: Home, label: 'Home' },
        { to: '/track', icon: Clock, label: 'Track' },
      ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-dark-900/85 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-black text-white flex items-center gap-1.5">
          <span>Pro</span>
          <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">Build</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive(to)
                  ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={15} /> {label}
            </Link>
          ))}

          {!currentUser && (
            <button
              onClick={handleSubmitClick}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <FileText size={15} /> Submit Project
            </button>
          )}
        </div>

        {/* Right side buttons */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                  {(currentUser.displayName || currentUser.email)[0].toUpperCase()}
                </div>
                <span className="text-sm text-gray-300 font-medium">
                  {isAdmin ? '🛡️ Admin' : (currentUser.displayName || currentUser.email.split('@')[0])}
                </span>
              </div>
              <button
                id="navbar-logout"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all"
              >
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <button
              id="navbar-login"
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-glow hover:shadow-glow-lg transition-all"
            >
              <LogIn size={15} /> Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-400 hover:text-white transition-colors p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-dark-800/95 backdrop-blur-xl border-t border-white/5 px-4 py-4 space-y-2">
          {navLinks.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive(to) ? 'bg-brand-500/10 text-brand-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} /> {label}
            </Link>
          ))}

          {!currentUser && (
            <button
              onClick={() => {
                setMobileOpen(false);
                openAuthModal('login', '/submit');
              }}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all text-left"
            >
              <FileText size={16} /> Submit Project
            </button>
          )}

          {currentUser ? (
            <button
              onClick={() => {
                handleLogout();
                setMobileOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all text-left"
            >
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <div className="pt-2 border-t border-white/5">
              <button
                id="mobile-navbar-login"
                onClick={() => {
                  setMobileOpen(false);
                  openAuthModal('login');
                }}
                className="w-full py-2.5 rounded-xl text-sm font-bold text-center bg-gradient-to-r from-brand-600 to-purple-600 text-white shadow-glow flex items-center justify-center gap-2"
              >
                <LogIn size={16} /> Sign In
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
