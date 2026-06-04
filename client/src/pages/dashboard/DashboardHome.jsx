import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { patientService } from '../../services/patientService';

const statCards = [
  {
    id: 'total-patients', label: 'Total Patients', value: '1,284', change: '+12.5%', trend: 'up',
    iconBg: 'bg-blue-50', iconColor: 'text-blue-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 'today-registrations', label: "Today's Registrations", value: '23', change: '+8.2%', trend: 'up',
    iconBg: 'bg-green-50', iconColor: 'text-green-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'active-doctors', label: 'Active Doctors', value: '47', change: '+2', trend: 'up',
    iconBg: 'bg-purple-50', iconColor: 'text-purple-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'pending-appointments', label: 'Pending Appointments', value: '18', change: '-3', trend: 'down',
    iconBg: 'bg-orange-50', iconColor: 'text-orange-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const chartData = [
  { day: 'Fri', patients: 18 }, { day: 'Sat', patients: 12 }, { day: 'Sun', patients: 8 },
  { day: 'Mon', patients: 25 }, { day: 'Tue', patients: 32 }, { day: 'Wed', patients: 28 },
  { day: 'Thu', patients: 23 },
];

const GenderBadge = ({ gender }) => {
  const colors = {
    male: 'bg-blue-100 text-blue-800', female: 'bg-pink-100 text-pink-800',
    other: 'bg-purple-100 text-purple-800', prefer_not_to_say: 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors[gender] || 'bg-gray-100 text-gray-800'}`}>
      {gender?.replace('_', ' ').charAt(0).toUpperCase() + gender?.slice(1)}
    </span>
  );
};

const TrendIndicator = ({ trend, change }) => {
  const isUp = trend === 'up';
  return (
    <span className={`inline-flex items-center text-xs font-semibold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
      <svg className={`w-3 h-3 mr-0.5 ${!isUp ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
      {change}
    </span>
  );
};

const DashboardHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await patientService.getAll({ limit: 5, page: 1 });
        setRecentPatients(response.data.data.patients || []);
      } catch (error) {
        console.error('Failed to fetch recent patients:', error);
        setRecentPatients([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋</h1>
        <p className="mt-1 text-gray-600">Here's what's happening at your hospital today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card) => (
          <div key={card.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">{card.label}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`${card.iconBg} ${card.iconColor} p-3 rounded-lg`}>{card.icon}</div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendIndicator trend={card.trend} change={card.change} />
              <span className="ml-2 text-xs text-gray-500">vs last week</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Patient Registrations</h2>
              <p className="text-sm text-gray-500">New patients per day (last 7 days)</p>
            </div>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }} labelStyle={{ fontWeight: 600, color: '#0f172a', marginBottom: 4 }} />
                <Bar dataKey="patients" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hospital Summary</h2>
          <dl className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <dt className="text-sm text-gray-600">Total Beds</dt>
              <dd className="text-sm font-semibold text-gray-900">150</dd>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <dt className="text-sm text-gray-600">Occupied Beds</dt>
              <dd className="text-sm font-semibold text-gray-900">112</dd>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <dt className="text-sm text-gray-600">Available Beds</dt>
              <dd className="text-sm font-semibold text-green-600">38</dd>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <dt className="text-sm text-gray-600">In-Patients</dt>
              <dd className="text-sm font-semibold text-gray-900">89</dd>
            </div>
            <div className="flex items-center justify-between py-2">
              <dt className="text-sm text-gray-600">Out-Patients Today</dt>
              <dd className="text-sm font-semibold text-gray-900">147</dd>
            </div>
          </dl>
          <button className="w-full mt-6 py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-sm rounded-lg transition-colors">View Full Report</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Patients</h2>
            <p className="text-sm text-gray-500 mt-0.5">Last 5 registered patients</p>
          </div>
          <button onClick={() => navigate('/patients')} className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">View All →</button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          </div>
        ) : recentPatients.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="mt-4 text-gray-500">No patients registered yet</p>
            <button onClick={() => navigate('/patients/new')} className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">Register First Patient</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {recentPatients.map((patient) => (
                  <tr key={patient.id} onClick={() => navigate(`/patients/${patient.id}`)} className="hover:bg-gray-50 cursor-pointer transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-9 h-9 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm">
                          {patient.first_name?.[0]}{patient.last_name?.[0]}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{patient.first_name} {patient.last_name}</p>
                          <p className="text-xs text-gray-500">{patient.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm font-mono text-blue-600">{patient.patient_number}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{patient.email || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><GenderBadge gender={patient.gender} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(patient.created_at)}</td>
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
