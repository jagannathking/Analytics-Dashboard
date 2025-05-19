import React, { useState } from 'react';
import { useNavigate, Link , useLocation} from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './AuthForm.css'; // Styles for the form

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // To get the 'from' state for redirection
  const from = location.state?.from?.pathname || "/";


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const success = await login({ username, password });
      if (success) {
        navigate(from, { replace: true }); 
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper card"> {/* Use .card for consistent styling */}
        <h2>Dashboard Login</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <p className="auth-error-message">{error}</p>}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="username"
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="auth-button full-width" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="auth-switch-text">
          {/* Don't have an account? <Link to="/register">Sign Up</Link> */}
          {/* For now, registration might be handled by an admin */}
        </p>
      </div>
    </div>
  );
};
export default LoginPage;