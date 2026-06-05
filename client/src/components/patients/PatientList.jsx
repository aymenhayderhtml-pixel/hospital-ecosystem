import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';

const GenderBadge = ({ gender }) => {
  const colors = {
    male: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    female: 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300',
    other: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
    prefer_not_to_say: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
  };
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[gender] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}>
      {gender.replace('_', ' ').charAt(0).toUpperCase() + gender.slice(1)}
    </span>
  );
};

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, totalPages: 1 });

  useEffect(() => { fetchPatients(); }, [pagination.page]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await patientService.getAll({ search, page: pagination.page, limit: pagination.limit });
      setPatients(response.data.data.patients);
      setPagination(response.data.data.pagination);
    } catch (error) { console.error('Failed to fetch patients:', error); } finally { setLoading(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); setPagination({ ...pagination, page: 1 }); };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Patients</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{pagination.total} {pagination.total === 1 ? 'patient' : 'patients'} registered</p>
        </div>
        <Link to="/patients/new" className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Register Patient
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, patient number, phone, or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
          <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">Search</button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No patients found</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{search ? 'Try adjusting your search terms' : 'Get started by registering your first patient'}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Patient Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Registered</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm font-mono font-medium text-blue-600 dark:text-blue-400">{patient.patient_number}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900 dark:text-white">{patient.first_name} {patient.last_name}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{patient.phone}</div>
                        {patient.email && <div className="text-sm text-gray-500 dark:text-gray-400">{patient.email}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap"><GenderBadge gender={patient.gender} /></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(patient.created_at)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => navigate(`/patients/${patient.id}`)} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <p className="text-sm text-gray-700 dark:text-gray-300">Showing page <span className="font-medium">{pagination.page}</span> of <span className="font-medium">{pagination.totalPages}</span></p>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })} disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </button>
                    <button onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })} disabled={pagination.page === pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                    </button>
                  </nav>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PatientList;
