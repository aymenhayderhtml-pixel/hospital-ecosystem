import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recordService } from '../../services/recordService';
import { patientService } from '../../services/patientService';

const PatientHistory = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [patientId]);

  const fetchData = async () => {
    try {
      const [patientRes, recordsRes] = await Promise.all([
        patientService.getById(patientId),
        recordService.getByPatient(patientId),
      ]);
      setPatient(patientRes.data.data.patient);
      setRecords(recordsRes.data.data.records || []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
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
    return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading history...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(`/patients/${patientId}`)}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white"
      >
        ← Back to Patient Profile
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Medical History</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Patient: {patient?.first_name} {patient?.last_name}
          </p>
        </div>
        <button
          onClick={() => navigate(`/patients/${patientId}/records/new`)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm"
        >
          + Add New Record
        </button>
      </div>

      <div className="space-y-4">
        {records.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center text-gray-500 dark:text-gray-400">
            No medical records found for this patient.
          </div>
        ) : (
          records.map((record, index) => (
            <div
              key={record.id}
              className="relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {index !== records.length - 1 && (
                <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gray-200 -mb-4" />
              )}

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-50 text-blue-700 rounded-full flex flex-col items-center justify-center font-bold border-4 border-white shadow-sm z-10">
                  <span className="text-xs uppercase">
                    {new Date(record.visit_date).toLocaleDateString('en-US', {
                      month: 'short',
                    })}
                  </span>
                  <span className="text-lg">
                    {new Date(record.visit_date).getDate()}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {record.diagnosis}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Dr. {record.doctor.name}
                        </span>{' '}
                        • {record.doctor.specialty}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/records/${record.id}`)}
                      className="flex-shrink-0 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      View Full
                    </button>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Symptoms:
                      </span>
                      <p className="text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
                        {record.symptoms}
                      </p>
                    </div>
                    {record.prescription && (
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Prescription:
                        </span>
                        <p className="text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
                          {record.prescription}
                        </p>
                      </div>
                    )}
                  </div>

                  {record.follow_up_date && (
                    <div className="mt-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800">
                      Follow-up: {formatDate(record.follow_up_date)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientHistory;
