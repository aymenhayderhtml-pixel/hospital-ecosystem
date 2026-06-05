import { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService';

const HospitalTab = () => {
  const [formData, setFormData] = useState({
    hospital_name: '',
    address: '',
    phone: '',
    email: '',
    logo_url: '',
    total_beds: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await settingsService.getHospitalInfo();
        const s = res.data.data.settings;
        if (s && s.id) setFormData(s);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await settingsService.updateHospitalInfo(formData);
      setMessage('Hospital information updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update information.');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading hospital info...</div>;

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Hospital Details</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.includes('success')
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Hospital Name *
          </label>
          <input
            required
            value={formData.hospital_name || ''}
            onChange={(e) =>
              setFormData({ ...formData, hospital_name: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone
            </label>
            <input
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Address
          </label>
          <textarea
            rows={2}
            value={formData.address || ''}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total Beds *
            </label>
            <input
              type="number"
              min="0"
              required
              value={formData.total_beds || 0}
              onChange={(e) =>
                setFormData({ ...formData, total_beds: parseInt(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Logo URL
            </label>
            <input
              value={formData.logo_url || ''}
              onChange={(e) =>
                setFormData({ ...formData, logo_url: e.target.value })
              }
              placeholder="https://..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default HospitalTab;
