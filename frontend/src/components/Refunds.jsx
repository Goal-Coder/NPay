import React, { useState, useEffect } from 'react';

export default function Refunds({ token, user }) {
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN';

  const [refunds, setRefunds] = useState([]);
  const [payments, setPayments] = useState([]);
  const [formData, setFormData] = useState({
    paymentId: '',
    amount: '',
    reason: ''
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const refRes = await fetch('/api/refunds', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (refRes.ok) {
        setRefunds(await refRes.json());
      }

      if (isAdmin) {
        const payRes = await fetch('/api/payments', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (payRes.ok) {
          setPayments(await payRes.json());
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, isAdmin]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const res = await fetch('/api/refunds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentId: parseInt(formData.paymentId),
          amount: formData.amount ? parseFloat(formData.amount) : null,
          reason: formData.reason
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Refund request failed');

      setMessage(`Refund Request Submitted! Refund ID: ${data.refundId} (Status: PENDING Admin Approval)`);
      setFormData({ paymentId: '', amount: '', reason: '' });
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleApprove = async (id) => {
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`/api/refunds/${id}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to approve refund');
      }
      setMessage(`Refund #${id} approved successfully!`);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReject = async (id) => {
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`/api/refunds/${id}/reject`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to reject refund');
      }
      setMessage(`Refund #${id} rejected.`);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="card">
        <h2>Request a Refund</h2>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Payment Transaction ID</label>
            {isAdmin && payments.length > 0 ? (
              <select
                name="paymentId"
                className="form-control"
                value={formData.paymentId}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Payment --</option>
                {payments
                  .filter((p) => p.status === 'SUCCESS')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      #{p.id} - {p.transactionId} ({p.currency} {p.amount})
                    </option>
                  ))}
              </select>
            ) : (
              <input
                type="number"
                name="paymentId"
                className="form-control"
                value={formData.paymentId}
                onChange={handleChange}
                placeholder="Enter Payment Record ID (e.g. 1)"
                required
              />
            )}
          </div>

          <div className="form-group">
            <label>Refund Amount (Leave empty for full refund)</label>
            <input
              type="number"
              step="0.01"
              name="amount"
              className="form-control"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Full Amount"
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Reason for Refund</label>
            <input
              type="text"
              name="reason"
              className="form-control"
              value={formData.reason}
              onChange={handleChange}
              placeholder="e.g. Customer request / Damaged goods"
              required
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <button type="submit" className="btn">Submit Refund Request</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Refund Requests & History</h2>
        {refunds.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No refund requests found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Refund Ref</th>
                <th>Payment ID</th>
                <th>Amount</th>
                <th>Reason</th>
                <th>Status</th>
                {isAdmin && <th>Action (Admin Only)</th>}
              </tr>
            </thead>
            <tbody>
              {refunds.map((r) => (
                <tr key={r.id}>
                  <td>#{r.id}</td>
                  <td style={{ fontFamily: 'monospace' }}>{r.refundId}</td>
                  <td>#{r.paymentId}</td>
                  <td>${r.amount}</td>
                  <td>{r.reason}</td>
                  <td>
                    <span className={`status-tag status-${r.status.toLowerCase()}`}>
                      {r.status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td>
                      {r.status === 'PENDING' ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleApprove(r.id)}
                            className="btn"
                            style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', backgroundColor: '#10b981' }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(r.id)}
                            className="btn btn-secondary"
                            style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', backgroundColor: '#ef4444', color: '#fff' }}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>-</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
