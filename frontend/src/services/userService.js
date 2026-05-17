import api from './api';

const userService = {
  login: (data) => api.post('/users/login', data),
  register: (data) => api.post('/users', data),
  getProfile: () => {
    const userId = localStorage.getItem('userId');
    return api.get(`/users/${userId}`);
  },
  updateProfile: (data) => {
    const userId = localStorage.getItem('userId');
    return api.put(`/users/${userId}`, data);
  },
  changePassword: (data) => {
    const userId = localStorage.getItem('userId');
    return api.post(`/users/${userId}/change-password`, data);
  },
};

export default userService;
