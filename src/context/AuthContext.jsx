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
