import { Routes, Route, Navigate } from 'react-router-dom'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div className="text-center p-8 text-xl font-semibold">🏥 Hospital Management System</div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
