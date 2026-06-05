import api from './api';

export const inventoryService = {
  getAll: (params = {}) => api.get('/inventory', { params }),
  getById: (id) => api.get(`/inventory/${id}`),
  create: (data) => api.post('/inventory', data),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  delete: (id) => api.delete(`/inventory/${id}`),
  getAlerts: () => api.get('/inventory/alerts'),
};

export default inventoryService;
