import React, { useState } from 'react';

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER'
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (isLogin) {
        setMessage('Login successful!');
        onLoginSuccess(data);
      } else {
        setMessage('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '480px', margin: '2rem auto' }}>
      <h2>{isLogin ? 'Sign In to NPay' : 'Create an Account'}</h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {!isLogin && (
          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              className="form-control"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="MERCHANT">MERCHANT</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        )}

        <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage(null);
            setError(null);
          }}
          style={{ border: 'none', color: 'var(--accent)', cursor: 'pointer' }}
        >
          {isLogin ? "Don't have an account? Register" : 'Already registered? Login'}
        </button>
      </div>
    </div>
  );
}
