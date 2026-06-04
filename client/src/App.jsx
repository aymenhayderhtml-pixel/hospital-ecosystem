import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardHome from './pages/dashboard/DashboardHome';
import PatientList from './components/patients/PatientList';
import PatientForm from './components/patients/PatientForm';
import PatientProfile from './components/patients/PatientProfile';

function App() {
  return (
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
            <Route
              path="/settings"
              element={
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
                  <p className="mt-2 text-gray-600">Settings page coming soon...</p>
                </div>
              }
            />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
