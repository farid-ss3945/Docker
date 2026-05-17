import { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import Invoices from './components/Invoices';
import Profile from './components/Profile';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [activeTab, setActiveTab] = useState('dashboard');


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    if (authMode === 'register') {
      return (
        <Register 
          onRegisterSuccess={() => setIsLoggedIn(true)} 
          onSwitchToLogin={() => setAuthMode('login')}
        />
      );
    }
    return (
      <Login 
        onLoginSuccess={() => setIsLoggedIn(true)} 
        onSwitchToRegister={() => setAuthMode('register')}
      />
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Invoice Manager</h1>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          Customers
        </button>
        <button
          className={`nav-item ${activeTab === 'invoices' ? 'active' : ''}`}
          onClick={() => setActiveTab('invoices')}
        >
          Invoices
        </button>
        <button
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'customers' && <Customers />}
        {activeTab === 'invoices' && <Invoices />}
        {activeTab === 'profile' && <Profile />}
      </main>
    </div>
  );
}

export default App;

