import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, FileText, Home, Shield, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = isAdmin
    ? [{ to: '/', icon: Home, label: 'Home' }, { to: '/admin', icon: Shield, label: 'Dashboard' }]
    : [{ to: '/', icon: Home, label: 'Home' }, { to: '/submit', icon: FileText, label: 'Submit' }, { to: '/dashboard', icon: LayoutDashboard, label: 'My Projects' }];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-black text-white">
          Pro<span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">Build</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive(to)
                  ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}>
              <Icon size={15} /> {label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                {(currentUser.displayName || currentUser.email)[0].toUpperCase()}
              </div>
              <span className="text-sm text-gray-300 font-medium">
                {isAdmin ? '🛡️ Admin' : (currentUser.displayName || currentUser.email.split('@')[0])}
              </span>
            </div>
          )}
          <button id="navbar-logout" onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all">
            <LogOut size={14} /> Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-400 hover:text-white transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-dark-800/95 backdrop-blur-xl border-t border-white/5 px-4 py-4 space-y-2">
          {navLinks.map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive(to) ? 'bg-brand-500/10 text-brand-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}>
              <Icon size={16} /> {label}
            </Link>
          ))}
          <button onClick={() => { handleLogout(); setMobileOpen(false); }}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
