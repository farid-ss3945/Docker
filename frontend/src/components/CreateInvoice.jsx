import { useState, useEffect } from 'react';
import customerService from '../services/customerService';
import invoiceService from '../services/invoiceService';
import './CreateInvoice.css';

export default function CreateInvoice({ onSuccess, existingInvoice, onCancel }) {
  const [formData, setFormData] = useState({
    customerId: '',
    amount: '',
    status: 'Pending',
    date: new Date().toISOString().split('T')[0],
  });
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
    if (existingInvoice) {
      setFormData(existingInvoice);
    }
  }, [existingInvoice]);

  const fetchCustomers = async () => {
    try {
      const response = await customerService.getAll();
      setCustomers(response.data);
    } catch (err) {
      setError('Failed to load customers');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Format data to match backend CreateInvoiceDto
      const selectedDate = new Date(formData.date);
      const submitData = {
        customerId: parseInt(formData.customerId),
        startDate: selectedDate.toISOString(),
        endDate: selectedDate.toISOString(),
        comment: null,
        rows: [
          {
            service: 'Service',
            quantity: 1,
            rate: parseFloat(formData.amount) || 0
          }
        ]
      };

      if (existingInvoice?.id) {
        await invoiceService.update(existingInvoice.id, submitData);
      } else {
        await invoiceService.create(submitData);
      }

      onSuccess();
      setFormData({ customerId: '', amount: '', status: 'Pending', date: new Date().toISOString().split('T')[0] });
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h3>{existingInvoice ? 'Edit Invoice' : 'Create Invoice'}</h3>
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="customerId">Customer *</label>
            <select
              id="customerId"
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              required
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="form-buttons">
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Saving...' : 'Save Invoice'}
            </button>
            {onCancel && (
              <button type="button" onClick={onCancel} className="btn-cancel">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
