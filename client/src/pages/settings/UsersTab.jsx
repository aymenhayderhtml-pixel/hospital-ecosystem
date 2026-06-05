import { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService';
import CreateUserModal from '../../components/settings/CreateUserModal';
import { useAuth } from '../../context/AuthContext';

const ROLES = ['admin', 'doctor', 'receptionist'];

const UsersTab = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await settingsService.getUsers();
      setUsers(res.data.data.users);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await settingsService.updateUserRole(userId, newRole);
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete "${userName}"? This will remove all their linked data.`))
      return;
    try {
      await settingsService.deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading)
    return <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading users...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">System Users</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg"
        >
          + Create User
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Joined</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{u.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{u.email}</td>
                <td className="px-6 py-4">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    disabled={u.id === currentUser.id}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 focus:ring-blue-500 disabled:bg-gray-100 dark:bg-gray-700 disabled:cursor-not-allowed"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r} className="capitalize">
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(u.id, u.name)}
                    disabled={u.id === currentUser.id}
                    className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <CreateUserModal
          onClose={() => setShowModal(false)}
          onUserCreated={fetchUsers}
        />
      )}
    </div>
  );
};

export default UsersTab;
