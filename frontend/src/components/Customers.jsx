import { useState, useEffect } from 'react';
import customerService from '../services/customerService';
import CreateCustomer from './CreateCustomer';
import './Customers.css';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await customerService.getAll();
      setCustomers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      await customerService.delete(id);
      setCustomers(customers.filter(c => c.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete customer');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCustomer(null);
    fetchCustomers();
  };

  if (loading) return <div className="loading">Loading customers...</div>;

  return (
    <div className="customers-container">
      <h2>Customers</h2>
      {error && <div className="error">{error}</div>}
      
      <div className="action-buttons">
        <button onClick={() => { setEditingCustomer(null); setShowForm(true); }} className="btn-add">
          + Add Customer
        </button>
        <button onClick={fetchCustomers} className="btn-refresh">
          Refresh
        </button>
      </div>

      {showForm && (
        <CreateCustomer 
          onSuccess={handleFormSuccess}
          existingCustomer={editingCustomer}
          onCancel={() => { setShowForm(false); setEditingCustomer(null); }}
        />
      )}

      <table className="customers-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>
                <button 
                  className="btn-action btn-edit"
                  onClick={() => { setEditingCustomer(customer); setShowForm(true); }}
                >
                  Edit
                </button>
                <button 
                  className="btn-action btn-delete"
                  onClick={() => handleDelete(customer.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {customers.length === 0 && !loading && (
        <p className="no-data">No customers found</p>
      )}
    </div>
  );
}
