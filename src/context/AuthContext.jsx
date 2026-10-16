import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChange, loginUser, registerUser, logoutUser, forgotPassword, ADMIN_EMAIL } from '../firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setCurrentUser(user);
      if (user) {
        setUserRole(user.email === ADMIN_EMAIL ? 'admin' : 'student');
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const [authModal, setAuthModal] = useState({
    isOpen: false,
    tab: 'login',
    redirectTo: '/submit',
  });

  const openAuthModal = (tab = 'login', redirectTo = '/submit') => {
    setAuthModal({ isOpen: true, tab, redirectTo });
  };

  const closeAuthModal = () => {
    setAuthModal(prev => ({ ...prev, isOpen: false }));
  };

  const setAuthModalTab = (tab) => {
    setAuthModal(prev => ({ ...prev, tab }));
  };

  const login = async (email, password) => loginUser(email, password);
  const register = async (name, email, password) => registerUser(name, email, password);
  const logout = async () => logoutUser();
  const sendResetEmail = async (email) => forgotPassword(email);

  const value = {
    currentUser,
    userRole,
    isAdmin: userRole === 'admin',
    isStudent: userRole === 'student',
    login,
    register,
    logout,
    sendResetEmail,
    loading,
    authModal,
    openAuthModal,
    closeAuthModal,
    setAuthModalTab,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
