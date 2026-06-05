import api from './api';

export const appointmentService = {
  create: (data) => api.post('/appointments', data),
  getAll: (params = {}) => api.get('/appointments', { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  updateStatus: (id, status) => api.patch(`/appointments/${id}/status`, { status }),
};

export default appointmentService;
