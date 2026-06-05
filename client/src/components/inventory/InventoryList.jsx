import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '../../services/inventoryService';

const CATEGORIES = ['all', 'medicine', 'equipment', 'supply'];

const InventoryList = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetchItems();
  }, [search, activeCategory]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = { search, limit: 100 };
      if (activeCategory !== 'all') params.category = activeCategory;

      const res = await inventoryService.getAll(params);
      setItems(res.data.data.items || []);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    return new Date(expiryDate) <= thirtyDaysFromNow;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inventory</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/inventory/alerts')}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg border border-red-200 dark:border-red-800 transition-colors"
          >
            View Alerts
          </button>
          <button
            onClick={() => navigate('/inventory/new')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
          >
            + Add Item
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by item name..."
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading inventory...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">No items found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Item Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Unit Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Expiry Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item) => {
                  const lowStock = item.quantity < item.min_quantity;
                  const expiring = isExpiringSoon(item.expiry_date);

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 capitalize">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {item.quantity} <span className="text-gray-500 dark:text-gray-400 text-xs">/ {item.unit}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ${Number(item.unit_price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{formatDate(item.expiry_date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {lowStock && (
                            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 w-fit">
                              Low Stock
                            </span>
                          )}
                          {expiring && (
                            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 w-fit">
                              Expiring
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <button
                          onClick={() => navigate(`/inventory/${item.id}/edit`)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm('Delete this item?')) {
                              try {
                                await inventoryService.delete(item.id);
                                fetchItems();
                              } catch (err) {
                                alert('Failed to delete item.');
                              }
                            }
                          }}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryList;
