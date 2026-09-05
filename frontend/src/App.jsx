import React, { useState } from 'react';
import Auth from './components/Auth';
import Payments from './components/Payments';
import Merchants from './components/Merchants';
import Refunds from './components/Refunds';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('npay_token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('npay_user') || 'null'));
  const [activeTab, setActiveTab] = useState('payments');

  const handleLoginSuccess = (loginData) => {
    setToken(loginData.token);
    const userData = {
      name: loginData.name,
      email: loginData.email,
      role: loginData.role
    };
    setUser(userData);
    localStorage.setItem('npay_token', loginData.token);
    localStorage.setItem('npay_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('npay_token');
    localStorage.removeItem('npay_user');
  };

  if (!token) {
    return (
      <div className="app-container">
        <header>
          <div className="logo-section">
            <div className="logo-badge">NPay</div>
            <h1>Payment Portal</h1>
          </div>
        </header>
        <Auth onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <div className="logo-section">
          <div className="logo-badge">NPay</div>
          <div>
            <h1 style={{ fontSize: '1.4rem' }}>Payment Gateway Dashboard</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Simple & Fast Payment Operations</p>
          </div>
        </div>
        <div className="user-info">
          <div>
            <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{user?.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {user?.email} <span className="user-role">{user?.role}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
            Logout
          </button>
        </div>
      </header>

      <nav className="tabs">
        <button
          className={`tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          💳 Payments
        </button>
        <button
          className={`tab-btn ${activeTab === 'merchants' ? 'active' : ''}`}
          onClick={() => setActiveTab('merchants')}
        >
          🏪 Merchants
        </button>
        <button
          className={`tab-btn ${activeTab === 'refunds' ? 'active' : ''}`}
          onClick={() => setActiveTab('refunds')}
        >
          🔄 Refunds
        </button>
      </nav>

      <main>
        {activeTab === 'payments' && <Payments token={token} user={user} />}
        {activeTab === 'merchants' && <Merchants token={token} />}
        {activeTab === 'refunds' && <Refunds token={token} user={user} />}
      </main>
    </div>
  );
}
