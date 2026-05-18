import { useState } from 'react';
import userService from '../services/userService';
import './Login.css';

export default function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const response = await userService.login({ email, password });
      console.log('Login response:', response.data);
      const token = response.data.token;
      localStorage.setItem('token', token);
      
      // Extract userId from response or JWT
      let userId = response.data.user?.id;
      console.log('User ID from response.data.user?.id:', userId);
      
      if (!userId) {
        userId = extractUserIdFromToken(token);
        console.log('User ID extracted from token:', userId);
      }
      
      if (userId) {
        localStorage.setItem('userId', String(userId));
        console.log('Stored userId in localStorage:', userId);
      } else {
        console.warn('No userId found in response or token!');
        setError('User ID not found in authentication response');
        return;
      }
      
      onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const extractUserIdFromToken = (token) => {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      console.log('JWT decoded:', decoded);
      // JWT often has 'sub' or 'userId' or 'nameid' or a numeric ID claim
      return decoded.sub || decoded.userId || decoded.nameid || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    } catch (e) {
      console.error('Error decoding JWT:', e);
      return null;
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
            />
          </div>

          <button type="submit" disabled={loading} className="btn-login">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="signup-link">
          Don't have an account?{' '}
          <button 
            type="button"
            onClick={onSwitchToRegister}
            className="link-button"
          >
            Sign up hered
          </button>
        </p>
      </div>
    </div>
  );
}
