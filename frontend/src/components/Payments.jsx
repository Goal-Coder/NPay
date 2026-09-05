import React, { useState, useEffect } from 'react';

export default function Payments({ token, user }) {
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN';

  const [payments, setPayments] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [selectedMerchantId, setSelectedMerchantId] = useState('');

  const [formData, setFormData] = useState({
    customerName: user ? user.name : '',
    customerEmail: user ? user.email : '',
    recipientName: '',
    recipientEmail: '',
    merchantId: '',
    amount: '',
    currency: 'INR',
    paymentMethod: 'UPI'
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

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/payments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(data);
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMerchants();
      fetchPayments();
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMerchantSelect = (e) => {
    const mId = e.target.value;
    setSelectedMerchantId(mId);

    if (mId === '') {
      setFormData(prev => ({
        ...prev,
        merchantId: '',
        recipientName: '',
        recipientEmail: ''
      }));
    } else {
      const m = merchants.find(item => item.id.toString() === mId);
      if (m) {
        setFormData(prev => ({
          ...prev,
          merchantId: m.id,
          recipientName: m.businessName || m.name,
          recipientEmail: m.email
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        merchantId: formData.merchantId ? parseInt(formData.merchantId) : null
      };

      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Payment failed');

      setMessage(`Payment Successful! Transaction ID: ${data.transactionId}`);
      setFormData(prev => ({
        ...prev,
        amount: '',
        recipientName: '',
        recipientEmail: '',
        merchantId: ''
      }));
      setSelectedMerchantId('');
      fetchPayments();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="card">
        <h2>Make a New Payment</h2>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Customer (Sender) Name</label>
            <input
              type="text"
              name="customerName"
              className="form-control"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Customer (Sender) Email</label>
            <input
              type="email"
              name="customerEmail"
              className="form-control"
              value={formData.customerEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Select Registered Merchant (Optional)</label>
            <select
              className="form-control"
              value={selectedMerchantId}
              onChange={handleMerchantSelect}
            >
              <option value="">-- Custom Recipient / Direct Payment --</option>
              {merchants.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.businessName || m.name} ({m.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Recipient / Merchant Name</label>
            <input
              type="text"
              name="recipientName"
              className="form-control"
              value={formData.recipientName}
              onChange={handleChange}
              placeholder="e.g. John Store / Acme Corp"
              required
            />
          </div>

          <div className="form-group">
            <label>Recipient / Merchant Email</label>
            <input
              type="email"
              name="recipientEmail"
              className="form-control"
              value={formData.recipientEmail}
              onChange={handleChange}
              placeholder="recipient@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              step="0.01"
              name="amount"
              className="form-control"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>

          <div className="form-group">
            <label>Currency</label>
            <select
              name="currency"
              className="form-control"
              value={formData.currency}
              onChange={handleChange}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="INR">INR (₹)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Payment Method</label>
            <select
              name="paymentMethod"
              className="form-control"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="DEBIT_CARD">Debit Card</option>
              <option value="UPI">UPI</option>
              <option value="NET_BANKING">Net Banking</option>
            </select>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <button type="submit" className="btn">Process Payment</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2>{isAdmin ? 'All System Transactions (Admin View)' : 'My Transaction History'}</h2>
        {payments.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No transactions found for your account.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Txn ID</th>
                <th>Sender (Customer)</th>
                <th>Recipient (Merchant / To)</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td style={{ fontFamily: 'monospace' }}>{p.transactionId}</td>
                  <td>{p.customerName}<br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.customerEmail}</span></td>
                  <td>{p.recipientName || 'N/A'}<br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.recipientEmail || ''}</span></td>
                  <td>{p.currency} {p.amount}</td>
                  <td>{p.paymentMethod}</td>
                  <td>
                    <span className={`status-tag status-${p.status.toLowerCase()}`}>
                      {p.status}
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
