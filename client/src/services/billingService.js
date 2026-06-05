import api from './api';

export const billingService = {
  create: (data) => api.post('/billing', data),
  getAll: () => api.get('/billing'),
  getById: (id) => api.get(`/billing/${id}`),
  updateStatus: (id, status) => api.patch(`/billing/${id}/status`, { status }),
  getByPatient: (patientId) => api.get(`/billing/patient/${patientId}`),
};

export default billingService;
