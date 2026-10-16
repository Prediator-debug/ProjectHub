import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, LayoutDashboard, FileText, Home, Shield, Menu, X, Clock, LogIn, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { currentUser, isAdmin, logout, openAuthModal } = useAuth();
  const { isDark, toggleTheme } = useTheme();
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
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#080c14]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-[#1c2a3e] shadow-sm transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-black text-slate-900 dark:text-[#e8edf5] flex items-center gap-1.5 tracking-tight">
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
                  ? 'bg-blue-50 dark:bg-[#0a1628] text-blue-600 dark:text-[#4f8ef7] border border-blue-200/70 dark:border-[#1c3a6e] font-semibold'
                  : 'text-slate-600 dark:text-[#8b9ab4] hover:text-slate-900 dark:hover:text-[#e8edf5] hover:bg-slate-100 dark:hover:bg-[#111827]'
              }`}
            >
              <Icon size={15} /> {label}
            </Link>
          ))}

          {!currentUser && (
            <button
              onClick={handleSubmitClick}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-[#8b9ab4] hover:text-slate-900 dark:hover:text-[#e8edf5] hover:bg-slate-100 dark:hover:bg-[#111827] transition-all"
            >
              <FileText size={15} /> Submit Project
            </button>
          )}
        </div>

        {/* Right side buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-desktop"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 dark:border-[#1c2a3e] bg-white dark:bg-[#0d1117] text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-[#111827] shadow-sm transition-transform active:scale-90 hover:scale-105"
          >
            {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-slate-600" />}
          </button>

          {currentUser ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-[#1c2a3e]">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                  {(currentUser.displayName || currentUser.email)[0].toUpperCase()}
                </div>
                <span className="text-sm text-slate-700 dark:text-[#c5d0e0] font-medium">
                  {isAdmin ? '🛡️ Admin' : (currentUser.displayName || currentUser.email.split('@')[0])}
                </span>
              </div>
              <button
                id="navbar-logout"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all"
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

        {/* Mobile Header Controls: Theme toggle + Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-[#1c2a3e] bg-white dark:bg-[#0d1117] text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-[#111827] transition-transform active:scale-90 hover:scale-105 shadow-sm"
          >
            {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-slate-600" />}
          </button>
          <button
            className="text-slate-700 dark:text-[#8b9ab4] hover:text-slate-900 dark:hover:text-[#e8edf5] p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#111827] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-[#0a0e18] backdrop-blur-2xl border-t border-slate-200 dark:border-[#1c2a3e] px-4 py-3 space-y-1.5 shadow-xl max-h-[85vh] overflow-y-auto">
          {navLinks.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive(to)
                  ? 'bg-blue-50 dark:bg-[#0a1628] text-blue-600 dark:text-[#4f8ef7] border dark:border-[#1c3a6e] font-semibold'
                  : 'text-slate-700 dark:text-[#8b9ab4] hover:text-slate-900 dark:hover:text-[#e8edf5] hover:bg-slate-50 dark:hover:bg-[#111827]'
              }`}
            >
              <Icon size={17} /> {label}
            </Link>
          ))}

          {!currentUser && (
            <button
              onClick={() => {
                setMobileOpen(false);
                openAuthModal('login', '/submit');
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-[#8b9ab4] hover:text-slate-900 dark:hover:text-[#e8edf5] hover:bg-slate-50 dark:hover:bg-[#111827] transition-all text-left"
            >
              <FileText size={17} /> Submit Project
            </button>
          )}

          {currentUser ? (
            <div className="pt-2 border-t border-slate-100 dark:border-[#1c2a3e] space-y-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#1c2a3e]">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                  {(currentUser.displayName || currentUser.email)[0].toUpperCase()}
                </div>
                <span className="text-xs text-slate-700 dark:text-[#c5d0e0] font-medium truncate">
                  {isAdmin ? '🛡️ Admin' : (currentUser.displayName || currentUser.email)}
                </span>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 dark:border-[#1c2a3e]">
              <button
                id="mobile-navbar-login"
                onClick={() => {
                  setMobileOpen(false);
                  openAuthModal('login');
                }}
                className="w-full py-3 rounded-xl text-sm font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm flex items-center justify-center gap-2"
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
