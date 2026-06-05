import api from './api';

export const doctorService = {
  getAll: (params = {}) => api.get('/doctors', { params }),
  getById: (id) => api.get(`/doctors/${id}`),
};

export default doctorService;
