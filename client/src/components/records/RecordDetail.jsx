import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recordService } from '../../services/recordService';

const RecordDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecord();
  }, [id]);

  const fetchRecord = async () => {
    try {
      const res = await recordService.getById(id);
      setRecord(res.data.data.record);
    } catch (error) {
      alert('Failed to load record details.');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading)
    return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading record...</div>;
  if (!record)
    return <div className="p-8 text-center text-red-600">Record not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white">
          ← Back
        </button>
        <button
          onClick={() => navigate(`/records/${id}/edit`)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm"
        >
          Edit Record
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{record.diagnosis}</h1>
              <p className="text-blue-100 mt-1">
                Visit Date: {formatDate(record.visit_date)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">Dr. {record.doctor.name}</p>
              <p className="text-sm text-blue-100">{record.doctor.specialty}</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Patient
              </h3>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {record.patient.first_name} {record.patient.last_name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DOB: {formatDate(record.patient.date_of_birth)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Phone: {record.patient.phone}
              </p>
            </div>
            {record.appointment && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Linked Appointment
                </h3>
                <p className="text-sm text-gray-900 dark:text-white">
                  {formatDate(record.appointment.appointment_date)} at{' '}
                  {record.appointment.appointment_time}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Reason: {record.appointment.reason}
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Symptoms
            </h3>
            <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{record.symptoms}</p>
          </div>

          {record.prescription && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Prescription
              </h3>
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                {record.prescription}
              </p>
            </div>
          )}

          {record.notes && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Clinical Notes
              </h3>
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{record.notes}</p>
            </div>
          )}

          {record.follow_up_date && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="inline-flex items-center px-4 py-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800 font-medium">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Follow-up Required: {formatDate(record.follow_up_date)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordDetail;
