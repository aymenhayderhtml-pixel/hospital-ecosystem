import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';

const InfoRow = ({ label, value }) => (
  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
      {value || <span className="text-gray-400 dark:text-gray-500 italic">Not provided</span>}
    </dd>
  </div>
);

const PatientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchPatient(); }, [id]);

  const fetchPatient = async () => {
    try {
      const response = await patientService.getById(id);
      setPatient(response.data.data.patient);
    } catch (err) {
      setError('Failed to load patient information');
      console.error('Fetch patient error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg className="animate-spin h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <h3 className="mt-4 text-lg font-medium text-red-900">{error || 'Patient not found'}</h3>
          <button onClick={() => navigate('/patients')} className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">Back to Patients</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button onClick={() => navigate('/patients')} className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white mb-4 transition-colors">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Patients
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{patient.full_name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Patient ID: {patient.patient_number}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate(`/patients/${id}/history`)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-sm transition-colors">Medical History</button>
            <button onClick={() => navigate(`/patients/${id}/edit`)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors">Edit Patient</button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
              {patient.first_name.charAt(0)}{patient.last_name.charAt(0)}
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold">{patient.full_name}</h2>
              <p className="text-blue-100">{patient.age} years old &bull; {patient.gender}</p>
              {patient.blood_type && patient.blood_type !== 'unknown' && (
                <span className="inline-block mt-2 px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">Blood Type: {patient.blood_type}</span>
              )}
            </div>
          </div>
        </div>

        <div className="px-8 py-6 space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Personal Information</h3>
            <dl className="divide-y divide-gray-200 dark:divide-gray-700">
              <InfoRow label="Full Name" value={patient.full_name} />
              <InfoRow label="Date of Birth" value={formatDate(patient.date_of_birth)} />
              <InfoRow label="Age" value={`${patient.age} years`} />
              <InfoRow label="Gender" value={patient.gender.replace('_', ' ').charAt(0).toUpperCase() + patient.gender.slice(1)} />
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Contact Information</h3>
            <dl className="divide-y divide-gray-200 dark:divide-gray-700">
              <InfoRow label="Phone" value={patient.phone} />
              <InfoRow label="Email" value={patient.email} />
              <InfoRow label="Address" value={patient.address} />
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Medical Information</h3>
            <dl className="divide-y divide-gray-200 dark:divide-gray-700">
              <InfoRow label="Blood Type" value={patient.blood_type === 'unknown' ? null : patient.blood_type} />
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Emergency Contact</h3>
            <dl className="divide-y divide-gray-200 dark:divide-gray-700">
              <InfoRow label="Contact Name" value={patient.emergency_contact_name} />
              <InfoRow label="Contact Phone" value={patient.emergency_contact_phone} />
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">System Information</h3>
            <dl className="divide-y divide-gray-200 dark:divide-gray-700">
              <InfoRow label="Patient Number" value={patient.patient_number} />
              <InfoRow label="Registered On" value={formatDate(patient.created_at)} />
              <InfoRow label="Registered By" value={patient.created_by_user ? patient.created_by_user.name : null} />
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
