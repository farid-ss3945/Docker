import api from './api';

const customerService = {
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
  getStats: (startDate, endDate) => api.get('/customers/stats', { params: { startDate, endDate } }),
};

export default customerService;
