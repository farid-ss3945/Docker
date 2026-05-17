import { useState, useEffect } from 'react';
import customerService from '../services/customerService';
import invoiceService from '../services/invoiceService';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalInvoices: 0,
    totalAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [customersRes, invoicesRes] = await Promise.all([
        customerService.getAll(),
        invoiceService.getAll(),
      ]);

      const totalAmount = invoicesRes.data.reduce((sum, inv) => sum + (inv.amount || 0), 0);

      setStats({
        totalCustomers: customersRes.data?.length || 0,
        totalInvoices: invoicesRes.data?.length || 0,
        totalAmount: totalAmount,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      {error && <div className="error">{error}</div>}
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Customers</h3>
          <p className="stat-value">{stats.totalCustomers}</p>
        </div>

        <div className="stat-card">
          <h3>Total Invoices</h3>
          <p className="stat-value">{stats.totalInvoices}</p>
        </div>

        <div className="stat-card">
          <h3>Total Amount</h3>
          <p className="stat-value">${stats.totalAmount?.toFixed(2)}</p>
        </div>
      </div>

      <button onClick={fetchStats} className="btn-refresh">
        Refresh Stats
      </button>
    </div>
  );
}
