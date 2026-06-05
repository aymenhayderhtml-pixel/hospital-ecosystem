import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentService } from '../../services/appointmentService';
import { patientService } from '../../services/patientService';
import { doctorService } from '../../services/doctorService';

const AppointmentForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    reason: '',
    notes: '',
  });

  useEffect(() => {
    patientService.getAll({ limit: 100 }).then((res) => setPatients(res.data.data.patients || []));
    doctorService.getAll({ limit: 100 }).then((res) => setDoctors(res.data.data.doctors || []));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await appointmentService.create(formData);
      navigate('/appointments');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to book appointment.';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/appointments')}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white mb-4"
      >
        ← Back to Appointments
      </button>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Book New Appointment</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Patient *</label>
              <select
                name="patient_id"
                value={formData.patient_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.first_name} {p.last_name} ({p.patient_number})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Doctor *</label>
              <select
                name="doctor_id"
                value={formData.doctor_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Doctor</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    Dr. {d.name} - {d.specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date *</label>
              <input
                type="date"
                name="appointment_date"
                value={formData.appointment_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time *</label>
              <input
                type="time"
                name="appointment_time"
                value={formData.appointment_time}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reason for Visit *</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., Annual checkup, fever, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Optional notes..."
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/appointments')}
              className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-sm flex items-center justify-center"
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
