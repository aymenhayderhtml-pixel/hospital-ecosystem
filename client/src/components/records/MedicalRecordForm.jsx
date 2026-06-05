import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { recordService } from '../../services/recordService';
import { patientService } from '../../services/patientService';
import { doctorService } from '../../services/doctorService';

const MedicalRecordForm = () => {
  const { patientId, recordId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    patient_id: patientId || '',
    doctor_id: '',
    appointment_id: '',
    visit_date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    symptoms: '',
    prescription: '',
    notes: '',
    follow_up_date: '',
  });

  useEffect(() => {
    patientService.getAll({ limit: 100 }).then((res) => setPatients(res.data.data.patients || []));
    doctorService.getAll({ limit: 100 }).then((res) => setDoctors(res.data.data.doctors || []));

    if (recordId) {
      fetchRecord();
    }
  }, [recordId]);

  const fetchRecord = async () => {
    try {
      const res = await recordService.getById(recordId);
      const record = res.data.data.record;
      setFormData({
        patient_id: record.patient.id,
        doctor_id: record.doctor.id,
        appointment_id: record.appointment?.id || '',
        visit_date: record.visit_date,
        diagnosis: record.diagnosis,
        symptoms: record.symptoms,
        prescription: record.prescription || '',
        notes: record.notes || '',
        follow_up_date: record.follow_up_date || '',
      });
    } catch (error) {
      alert('Failed to load record.');
      navigate('/patients');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData };
      if (!payload.appointment_id) delete payload.appointment_id;
      if (!payload.follow_up_date) delete payload.follow_up_date;

      if (recordId) {
        await recordService.update(recordId, payload);
      } else {
        await recordService.create(payload);
      }
      navigate(`/patients/${formData.patient_id}/history`);
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.errors?.[0]?.message || 'Operation failed';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white mb-4">
        ← Back
      </button>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {recordId ? 'Edit Medical Record' : 'New Medical Record'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Patient *</label>
              <select
                name="patient_id"
                value={formData.patient_id}
                onChange={handleChange}
                required
                disabled={!!patientId}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
              >
                <option value="">Select Patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.first_name} {p.last_name}
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
                    Dr. {d.name} ({d.specialty})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Visit Date *</label>
              <input
                type="date"
                name="visit_date"
                value={formData.visit_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Follow-up Date</label>
              <input
                type="date"
                name="follow_up_date"
                value={formData.follow_up_date}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Symptoms *</label>
            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Describe the patient's symptoms..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Diagnosis *</label>
            <textarea
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Clinical diagnosis..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prescription</label>
            <textarea
              name="prescription"
              value={formData.prescription}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Medications and dosages..."
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
              placeholder="Any other relevant clinical notes..."
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-sm flex items-center justify-center"
            >
              {loading ? 'Saving...' : recordId ? 'Update Record' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicalRecordForm;
