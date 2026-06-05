import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../context/AuthContext';

const AppointmentList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [filterDate]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterDate) params.date = filterDate;
      const res = await appointmentService.getAll(params);
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

  const StatusBadge = ({ status }) => {
    const colors = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      confirmed: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${colors[status] || 'bg-gray-100 text-gray-800'}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Appointments</h1>
        {(user?.role === 'admin' || user?.role === 'receptionist') && (
          <button
            onClick={() => navigate('/appointments/new')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm"
          >
            + Book Appointment
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex gap-4">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {filterDate && (
          <button
            onClick={() => setFilterDate('')}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">No appointments found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(appt.appointment_date).toLocaleDateString()}
                      <br />
                      <span className="text-gray-500 dark:text-gray-400">{appt.appointment_time}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {appt.patient?.first_name || "—"} {appt.patient?.last_name || ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {appt.doctor?.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                      {appt.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={appt.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {appt.status === 'pending' &&
                        (user?.role === 'admin' || user?.role === 'receptionist') && (
                          <>
                            <button
                              onClick={() => handleStatusChange(appt.id, 'confirmed')}
                              className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleStatusChange(appt.id, 'cancelled')}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentList;
