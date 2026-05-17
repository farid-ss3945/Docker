import { useState, useEffect } from 'react';
import customerService from '../services/customerService';
import './CreateCustomer.css';

export default function CreateCustomer({ onSuccess, existingCustomer, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (existingCustomer) {
      setFormData(existingCustomer);
    }
  }, [existingCustomer]);

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

      // Format data to match backend CreateCustomerDto
      const userId = parseInt(localStorage.getItem('userId'));
      const submitData = {
        userId: userId,
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        address: formData.address,
      };

      if (existingCustomer?.id) {
        await customerService.update(existingCustomer.id, submitData);
      } else {
        await customerService.create(submitData);
      }

      onSuccess();
      setFormData({ name: '', email: '', phone: '', address: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h3>{existingCustomer ? 'Edit Customer' : 'Add New Customer'}</h3>
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-buttons">
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Saving...' : 'Save Customer'}
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
