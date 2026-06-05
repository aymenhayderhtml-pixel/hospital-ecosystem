import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import UsersTab from './UsersTab';
import HospitalTab from './HospitalTab';
import ProfileTab from './ProfileTab';

const TABS = [
  { id: 'users', label: 'User Management', icon: '👥', adminOnly: true },
  { id: 'hospital', label: 'Hospital Info', icon: '🏥', adminOnly: true },
  { id: 'profile', label: 'My Profile', icon: '👤', adminOnly: false },
];

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const visibleTabs = TABS.filter((tab) => !tab.adminOnly || user?.role === 'admin');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage system configuration and your account</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px overflow-x-auto">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:border-gray-600'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'hospital' && <HospitalTab />}
          {activeTab === 'profile' && <ProfileTab />}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
