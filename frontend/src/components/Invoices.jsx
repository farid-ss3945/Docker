import { useState, useEffect } from 'react';
import invoiceService from '../services/invoiceService';
import CreateInvoice from './CreateInvoice';
import './Invoices.css';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await invoiceService.getAll();
      setInvoices(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;

    try {
      await invoiceService.delete(id);
      setInvoices(invoices.filter(inv => inv.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete invoice');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingInvoice(null);
    fetchInvoices();
  };

  if (loading) return <div className="loading">Loading invoices...</div>;

  return (
    <div className="invoices-container">
      <h2>Invoices</h2>
      {error && <div className="error">{error}</div>}
      
      <div className="action-buttons">
        <button onClick={() => { setEditingInvoice(null); setShowForm(true); }} className="btn-add">
          + Create Invoice
        </button>
        <button onClick={fetchInvoices} className="btn-refresh">
          Refresh
        </button>
      </div>

      {showForm && (
        <CreateInvoice 
          onSuccess={handleFormSuccess}
          existingInvoice={editingInvoice}
          onCancel={() => { setShowForm(false); setEditingInvoice(null); }}
        />
      )}

      <table className="invoices-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.id}</td>
              <td>{invoice.customerName}</td>
              <td>${invoice.amount?.toFixed(2)}</td>
              <td className={`status-${String(invoice.status || 'unknown').toLowerCase()}`}>
                {invoice.status || 'Unknown'}
              </td>
              <td>{new Date(invoice.date).toLocaleDateString()}</td>
              <td>
                <button 
                  className="btn-action btn-edit"
                  onClick={() => { setEditingInvoice(invoice); setShowForm(true); }}
                >
                  Edit
                </button>
                <button 
                  className="btn-action btn-delete"
                  onClick={() => handleDelete(invoice.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {invoices.length === 0 && !loading && (
        <p className="no-data">No invoices found</p>
      )}
    </div>
  );
}
