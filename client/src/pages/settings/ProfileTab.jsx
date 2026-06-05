import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { settingsService } from '../../services/settingsService';

const ProfileTab = () => {
  const { user } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [profileMsg, setProfileMsg] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  const [pwdData, setPwdData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [pwdMsg, setPwdMsg] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg('');
    try {
      await settingsService.updateProfile(profileData);
      setProfileMsg('Profile updated successfully!');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (error) {
      setProfileMsg(error.response?.data?.message || 'Update failed');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwdLoading(true);
    setPwdMsg('');
    try {
      await settingsService.changePassword(pwdData);
      setPwdMsg('Password changed successfully!');
      setPwdData({ current_password: '', new_password: '', confirm_password: '' });
      setTimeout(() => setPwdMsg(''), 3000);
    } catch (error) {
      setPwdMsg(error.response?.data?.message || 'Password change failed');
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Personal Information
        </h2>
        {profileMsg && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              profileMsg.includes('success')
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {profileMsg}
          </div>
        )}

        <form
          onSubmit={handleProfileSubmit}
          className="space-y-4 bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              required
              value={profileData.name}
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={profileData.email}
              onChange={(e) =>
                setProfileData({ ...profileData, email: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <input
              value={user?.role || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 text-gray-500 dark:text-gray-400 cursor-not-allowed capitalize"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Only an administrator can change your role.
            </p>
          </div>
          <button
            type="submit"
            disabled={profileLoading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50"
          >
            {profileLoading ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Change Password
        </h2>
        {pwdMsg && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              pwdMsg.includes('success')
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {pwdMsg}
          </div>
        )}

        <form
          onSubmit={handlePasswordSubmit}
          className="space-y-4 bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={pwdData.current_password}
              onChange={(e) =>
                setPwdData({ ...pwdData, current_password: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={pwdData.new_password}
                onChange={(e) =>
                  setPwdData({ ...pwdData, new_password: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={pwdData.confirm_password}
                onChange={(e) =>
                  setPwdData({ ...pwdData, confirm_password: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={pwdLoading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50"
          >
            {pwdLoading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileTab;
