import api from './api';

export const settingsService = {
  getUsers: () => api.get('/settings/users'),
  createUser: (data) => api.post('/settings/users', data),
  updateUserRole: (id, role) => api.patch(`/settings/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/settings/users/${id}`),

  getHospitalInfo: () => api.get('/settings/hospital'),
  updateHospitalInfo: (data) => api.put('/settings/hospital', data),

  updateProfile: (data) => api.patch('/settings/profile', data),
  changePassword: (data) => api.patch('/settings/password', data),
};

export default settingsService;
