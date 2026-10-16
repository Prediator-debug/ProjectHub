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
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-subtle">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-black text-slate-900 flex items-center gap-1.5 tracking-tight">
          <span>Pro</span>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Build</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive(to)
                  ? 'bg-blue-50 text-blue-600 border border-blue-200/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon size={15} /> {label}
            </Link>
          ))}

          {!currentUser && (
            <button
              onClick={handleSubmitClick}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
            >
              <FileText size={15} /> Submit Project
            </button>
          )}
        </div>

        {/* Right side buttons */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                  {(currentUser.displayName || currentUser.email)[0].toUpperCase()}
                </div>
                <span className="text-sm text-slate-700 font-medium">
                  {isAdmin ? '🛡️ Admin' : (currentUser.displayName || currentUser.email.split('@')[0])}
                </span>
              </div>
              <button
                id="navbar-logout"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-all"
              >
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <button
              id="navbar-login"
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm shadow-blue-500/20 hover:shadow-md transition-all"
            >
              <LogIn size={15} /> Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-slate-600 hover:text-slate-900 transition-colors p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200 px-4 py-4 space-y-2 shadow-lg">
          {navLinks.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive(to) ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
              className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all text-left"
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
              className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all text-left"
            >
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <div className="pt-2 border-t border-slate-200">
              <button
                id="mobile-navbar-login"
                onClick={() => {
                  setMobileOpen(false);
                  openAuthModal('login');
                }}
                className="w-full py-2.5 rounded-xl text-sm font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm flex items-center justify-center gap-2"
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
