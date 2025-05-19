import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx'; // Path to your AuthContext

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined || context === null) { // Check for null too
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;