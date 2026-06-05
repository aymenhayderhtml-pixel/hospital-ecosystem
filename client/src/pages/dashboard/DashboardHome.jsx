import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import { patientService } from '../../services/patientService';
import AppointmentsBarChart from '../../components/dashboard/AppointmentsBarChart';
import TopDiagnosesChart from '../../components/dashboard/TopDiagnosesChart';
import { useAuth } from '../../context/AuthContext';

const GenderBadge = ({ gender }) => {
  const colors = {
    male: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    female: 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300',
    other: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
    prefer_not_to_say: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
  };
  return (
    <span
      className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors[gender] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}
    >
      {gender?.replace('_', ' ').charAt(0).toUpperCase() + gender?.slice(1)}
    </span>
  );
};

const StatSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24 mb-3" />
        <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-16" />
      </div>
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg" />
    </div>
  </div>
);

const DashboardHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [diagnosesData, setDiagnosesData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, chartRes, diagnosesRes, summaryRes, patientsRes] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getAppointmentsChart(),
          dashboardService.getTopDiagnoses(),
          dashboardService.getHospitalSummary(),
          patientService.getAll({ limit: 5, page: 1 }),
        ]);

        setStats(statsRes.data.data);
        setChartData(chartRes.data.data);
        setDiagnosesData(diagnosesRes.data.data);
        setSummary(summaryRes.data.data);
        setRecentPatients(patientsRes.data.data.patients || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-64 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => <StatSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 h-96 animate-pulse" />
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 h-96 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Low Stock Warning Banner */}
      {stats?.low_stock_count > 0 && (
        <Link
          to="/inventory/alerts"
          className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-xl hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-semibold text-yellow-800 dark:text-yellow-300">Inventory Attention Required</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">{stats.low_stock_count} item(s) are low on stock or expiring soon.</p>
            </div>
          </div>
          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300 group-hover:underline">View Alerts &rarr;</span>
        </Link>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Here's what's happening at your hospital today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Patients</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats?.total_patients?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Today's Appointments</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats?.appointments_today || 0}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Doctors</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats?.doctors_count || 0}</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-3 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Appointments</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats?.pending_appointments || 0}</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 p-3 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appointments (Last 7 Days)</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Daily appointment volume</p>
            </div>
          </div>
          <AppointmentsBarChart data={chartData} />
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hospital Capacity</h2>
            <dl className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <dt className="text-sm text-gray-600 dark:text-gray-400">Total Beds</dt>
                <dd className="text-sm font-semibold text-gray-900 dark:text-white">{summary?.total_beds || 0}</dd>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <dt className="text-sm text-gray-600 dark:text-gray-400">Occupied (Today)</dt>
                <dd className="text-sm font-semibold text-gray-900 dark:text-white">{summary?.occupied_beds || 0}</dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-sm text-gray-600 dark:text-gray-400">Available Beds</dt>
                <dd className="text-sm font-semibold text-green-600 dark:text-green-400">{summary?.available_beds || 0}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Top Diagnoses</h2>
            <TopDiagnosesChart data={diagnosesData} />
          </div>
        </div>
      </div>

      {/* Recent Patients */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Patients</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Last 5 registered patients</p>
          </div>
          <button onClick={() => navigate('/patients')} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            View All &rarr;
          </button>
        </div>

        {recentPatients.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-gray-500 dark:text-gray-400">No patients registered yet</p>
            <button onClick={() => navigate('/patients/new')} className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
              Register First Patient
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Registered</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                {recentPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    onClick={() => navigate(`/patients/${patient.id}`)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-9 h-9 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-semibold text-sm">
                          {patient.first_name?.[0]}{patient.last_name?.[0]}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{patient.first_name} {patient.last_name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{patient.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-blue-600 dark:text-blue-400">{patient.patient_number}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{patient.email || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><GenderBadge gender={patient.gender} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(patient.created_at)}</td>
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

export default DashboardHome;
