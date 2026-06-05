import { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../context/AuthContext';

const DoctorAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'doctor') {
      fetchMyAppointments();
    }
  }, [user]);

  const fetchMyAppointments = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await appointmentService.getAll({ date: today });
      setAppointments(res.data.data.appointments || []);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await appointmentService.updateStatus(id, newStatus);
      setAppointments(
        appointments.map((appt) =>
          appt.id === id ? { ...appt, status: newStatus } : appt
        )
      );
    } catch (error) {
      alert('Failed to update status.');
    }
  };

  if (user?.role !== 'doctor') {
    return (
      <div className="p-8 text-center text-red-600">Access denied. Doctors only.</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Today's Appointments</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading...</div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium">No appointments scheduled for today.</p>
            <p className="text-sm mt-1">Enjoy your day off or catch up on notes!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center justify-center w-16 h-16 bg-blue-50 text-blue-700 rounded-lg font-bold">
                    <span className="text-xs uppercase">
                      {new Date(appt.appointment_date).toLocaleDateString('en-US', {
                        month: 'short',
                      })}
                    </span>
                    <span className="text-xl">
                      {new Date(appt.appointment_date).getDate()}
                    </span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {appt.patient?.first_name} {appt.patient?.last_name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {appt.appointment_time} &bull; {appt.reason}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Phone: {appt.patient?.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${
                      appt.status === 'pending'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                        : appt.status === 'confirmed'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                    }`}
                  >
                    {appt.status}
                  </span>
                  {appt.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(appt.id, 'confirmed')}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleStatusChange(appt.id, 'cancelled')}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
