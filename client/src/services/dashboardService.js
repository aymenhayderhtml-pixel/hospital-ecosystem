import api from './api';

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getAppointmentsChart: () => api.get('/dashboard/appointments-chart'),
  getTopDiagnoses: () => api.get('/dashboard/top-diagnoses'),
  getHospitalSummary: () => api.get('/dashboard/hospital-summary'),
};

export default dashboardService;
