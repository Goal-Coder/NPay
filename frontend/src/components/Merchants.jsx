import React, { useState, useEffect } from 'react';

export default function Merchants({ token }) {
  const [merchants, setMerchants] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessName: ''
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const fetchMerchants = async () => {
    try {
      const res = await fetch('/api/merchants', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMerchants(data);
      }
    } catch (err) {
      console.error('Error fetching merchants:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMerchants();
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const res = await fetch('/api/merchants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create merchant');

      setMessage(`Merchant registered successfully! Generated API Key: ${data.apiKey}`);
      setFormData({ name: '', email: '', businessName: '' });
      fetchMerchants();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="card">
        <h2>Register Merchant</h2>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Merchant Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Acme Corp"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              placeholder="merchant@example.com"
              required
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Business Name</label>
            <input
              type="text"
              name="businessName"
              className="form-control"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Official Registered Business Name"
              required
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <button type="submit" className="btn">Register Merchant</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Active Merchants</h2>
        {merchants.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No merchants registered yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Business</th>
                <th>API Key</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {merchants.map((m) => (
                <tr key={m.id}>
                  <td>#{m.id}</td>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{m.businessName}</td>
                  <td style={{ fontFamily: 'monospace' }}>{m.apiKey}</td>
                  <td>
                    <span className={`status-tag status-${m.status.toLowerCase()}`}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
