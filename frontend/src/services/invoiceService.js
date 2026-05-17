import api from './api';

const invoiceService = {
  getAll: () => api.get('/invoices'),
  getById: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post('/invoices', data),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  delete: (id) => api.delete(`/invoices/${id}`),
  getStats: (startDate, endDate) => api.get('/invoices/stats', { params: { startDate, endDate } }),
};

export default invoiceService;
