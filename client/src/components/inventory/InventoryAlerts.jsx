import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '../../services/inventoryService';

const InventoryAlerts = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState({ lowStock: [], expiringSoon: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await inventoryService.getAlerts();
      setAlerts(res.data.data);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading alerts...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inventory Alerts</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {alerts.totalAlerts} items require attention
          </p>
        </div>
        <button
          onClick={() => navigate('/inventory')}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Inventory
        </button>
      </div>

      {/* Low Stock Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 bg-yellow-50 border-b border-yellow-200 dark:border-yellow-800 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-lg font-semibold text-yellow-800">
            Low Stock Items ({alerts.lowStock.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {alerts.lowStock.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No low stock items. Great job!
            </div>
          ) : (
            alerts.lowStock.map((item) => (
              <div
                key={item.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {item.category} &bull; {item.unit}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-yellow-700">
                    {item.quantity} / {item.min_quantity} min
                  </p>
                  <button
                    onClick={() => navigate(`/inventory/${item.id}/edit`)}
                    className="text-xs text-blue-600 hover:underline mt-1"
                  >
                    Restock
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Expiring Soon Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 bg-red-50 border-b border-red-200 dark:border-red-800 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-lg font-semibold text-red-800">
            Expiring Within 30 Days ({alerts.expiringSoon.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {alerts.expiringSoon.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No items expiring soon.
            </div>
          ) : (
            alerts.expiringSoon.map((item) => (
              <div
                key={item.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {item.category} &bull; Supplier:{' '}
                    {item.supplier_name || 'N/A'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-red-700">
                    Expires: {formatDate(item.expiry_date)}
                  </p>
                  <button
                    onClick={() => navigate(`/inventory/${item.id}/edit`)}
                    className="text-xs text-blue-600 hover:underline mt-1"
                  >
                    Update
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryAlerts;
