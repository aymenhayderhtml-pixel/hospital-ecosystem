import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardHome from './pages/dashboard/DashboardHome';
import PatientList from './components/patients/PatientList';
import PatientForm from './components/patients/PatientForm';
import PatientProfile from './components/patients/PatientProfile';
import AppointmentList from './components/appointments/AppointmentList';
import AppointmentForm from './components/appointments/AppointmentForm';
import DoctorAppointments from './components/appointments/DoctorAppointments';
import MedicalRecordForm from './components/records/MedicalRecordForm';
import PatientHistory from './components/records/PatientHistory';
import RecordDetail from './components/records/RecordDetail';
import InventoryList from './components/inventory/InventoryList';
import InventoryForm from './components/inventory/InventoryForm';
import InventoryAlerts from './components/inventory/InventoryAlerts';
import SettingsPage from './pages/settings/SettingsPage';
import InvoiceList from './components/billing/InvoiceList';
import InvoiceForm from './components/billing/InvoiceForm';
import InvoiceDetail from './components/billing/InvoiceDetail';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
          {/* Public auth routes (no sidebar) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes wrapped with MainLayout */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patients/new" element={<PatientForm />} />
            <Route path="/patients/:id" element={<PatientProfile />} />
            <Route path="/appointments" element={<AppointmentList />} />
            <Route path="/appointments/new" element={<AppointmentForm />} />
            <Route path="/my-appointments" element={<DoctorAppointments />} />
            <Route path="/patients/:patientId/history" element={<PatientHistory />} />
            <Route path="/patients/:patientId/records/new" element={<MedicalRecordForm />} />
            <Route path="/records/:id" element={<RecordDetail />} />
            <Route path="/records/:id/edit" element={<MedicalRecordForm />} />
            <Route path="/inventory" element={<InventoryList />} />
            <Route path="/inventory/new" element={<InventoryForm />} />
            <Route path="/inventory/:id/edit" element={<InventoryForm />} />
            <Route path="/inventory/alerts" element={<InventoryAlerts />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/billing" element={<InvoiceList />} />
            <Route path="/billing/new" element={<InvoiceForm />} />
            <Route path="/billing/:id" element={<InvoiceDetail />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
  </ThemeProvider>
);
}

export default App;
