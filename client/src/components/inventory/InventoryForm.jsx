import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { inventoryService } from '../../services/inventoryService';

const CATEGORIES = ['medicine', 'equipment', 'supply'];
const UNITS = ['tablets', 'ml', 'pieces', 'boxes'];

const InventoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'medicine',
    quantity: 0,
    unit: 'pieces',
    min_quantity: 0,
    unit_price: 0,
    supplier_name: '',
    expiry_date: '',
  });

  useEffect(() => {
    if (isEdit) fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const res = await inventoryService.getById(id);
      const item = res.data.data.item;
      setFormData({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        min_quantity: item.min_quantity,
        unit_price: item.unit_price,
        supplier_name: item.supplier_name || '',
        expiry_date: item.expiry_date || '',
      });
    } catch (error) {
      alert('Failed to load item.');
      navigate('/inventory');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'quantity' || name === 'min_quantity' || name === 'unit_price'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData };
      if (!payload.expiry_date) delete payload.expiry_date;
      if (!payload.supplier_name) delete payload.supplier_name;

      if (isEdit) {
        await inventoryService.update(id, payload);
      } else {
        await inventoryService.create(payload);
      }
      navigate('/inventory');
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        'Operation failed';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/inventory')}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white mb-4"
      >
        ← Back to Inventory
      </button>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {isEdit ? 'Edit Inventory Item' : 'Add New Item'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Item Name *
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none capitalize"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Unit *
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none capitalize"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min. Quantity *
              </label>
              <input
                type="number"
                name="min_quantity"
                value={formData.min_quantity}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Unit Price ($) *
              </label>
              <input
                type="number"
                name="unit_price"
                value={formData.unit_price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Supplier Name
              </label>
              <input
                name="supplier_name"
                value={formData.supplier_name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Expiry Date
              </label>
              <input
                type="date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/inventory')}
              className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-sm flex items-center justify-center"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryForm;
