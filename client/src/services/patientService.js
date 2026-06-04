import api from './api';

export const patientService = {
  create: (patientData) => api.post('/patients', patientData),
  getAll: (params = {}) => api.get('/patients', { params }),
  getById: (id) => api.get(`/patients/${id}`),
  update: (id, patientData) => api.put(`/patients/${id}`, patientData),
};

export default patientService;
