import api from './api';

export const recordService = {
  create: (data) => api.post('/records', data),
  getByPatient: (patientId) => api.get(`/records/patient/${patientId}`),
  getById: (id) => api.get(`/records/${id}`),
  update: (id, data) => api.put(`/records/${id}`, data),
};

export default recordService;
