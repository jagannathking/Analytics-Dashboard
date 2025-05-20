import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./AuthForm.css";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [email, setEmail] = useState(''); // Optional

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      // For self-registration, the backend typically assigns a default role (e.g., "viewer" or "manager")
      // The current backend `registerUser` controller might need adjustment if it strictly expects a role.
      // For now, we assume it can handle a request without a 'role' field for self-signup.
      const userData = { username, password };
      // if (email) userData.email = email;

      const result = await register(userData);

      if (result && result.success) {
        setSuccessMessage(result.message || "Registration successful! Redirecting to login...");
        setUsername(''); // Clear form
        setPassword('');
        setConfirmPassword('');
        // setEmail('');
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      } else {
        // This branch might not be hit if 'register' in AuthContext throws on any API error
        setError(result?.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Registration failed. An unexpected error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper card">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <p className="auth-feedback-message auth-error-message">{error}</p>}
          {successMessage && (
            <p className="auth-feedback-message auth-success-message">{successMessage}</p>
          )}

          <div className="form-group">
            <label htmlFor="register-username">Username</label> {/* Unique ID */}
            <input
              type="text"
              id="register-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Choose a username"
            />
          </div>

          {/*
          <div className="form-group">
            <label htmlFor="register-email">Email (Optional)</label>
            <input
              type="email"
              id="register-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              placeholder="your@email.com"
            />
          </div>
          */}

          <div className="form-group">
            <label htmlFor="register-password">Password</label> {/* Unique ID */}
            <input
              type="password"
              id="register-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Create a password (min. 6 chars)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            className="auth-button full-width"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="auth-switch-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;