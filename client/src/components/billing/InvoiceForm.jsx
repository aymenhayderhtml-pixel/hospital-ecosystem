import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { billingService } from '../../services/billingService';
import { patientService } from '../../services/patientService';
import { inventoryService } from '../../services/inventoryService';

const InvoiceForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [formData, setFormData] = useState({
    patient_id: '',
    medical_record_id: '',
    notes: '',
    items: [{ item_type: 'service', inventory_item_id: '', item_name: '', quantity: 1, unit_price: 0, total_price: 0 }],
    tax_rate: 0.15,
  });

  useEffect(() => {
    patientService.getAll({ limit: 100 }).then((res) => setPatients(res.data.data.patients || []));
    inventoryService.getAll({ limit: 100 }).then((res) => setInventory(res.data.data.items || []));
  }, []);

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    if (field === 'inventory_item_id' && value) {
      const invItem = inventory.find((i) => i.id === value);
      if (invItem) {
        newItems[index].item_name = invItem.name;
        newItems[index].unit_price = Number(invItem.unit_price);
      }
    }

    const qty = Number(newItems[index].quantity) || 0;
    const price = Number(newItems[index].unit_price) || 0;
    newItems[index].total_price = qty * price;

    setFormData({ ...formData, items: newItems });
  };

  const addItemRow = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { item_type: 'service', inventory_item_id: '', item_name: '', quantity: 1, unit_price: 0, total_price: 0 },
      ],
    });
  };

  const removeItemRow = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const subtotal = formData.items.reduce((sum, item) => sum + item.total_price, 0);
  const tax_amount = subtotal * formData.tax_rate;
  const total_amount = subtotal + tax_amount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.items.length === 0 || !formData.patient_id) {
      alert('Please select a patient and add at least one item.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        patient_id: formData.patient_id,
        medical_record_id: formData.medical_record_id || null,
        notes: formData.notes,
        items: formData.items,
        subtotal,
        tax_amount,
        total_amount,
      };
      await billingService.create(payload);
      navigate('/billing');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create invoice. Check inventory levels.';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/billing')}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white mb-4"
      >
        ← Back to Invoices
      </button>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create New Invoice</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Patient *</label>
              <select
                required
                value={formData.patient_id}
                onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.first_name} {p.last_name} ({p.patient_number})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Linked Medical Record (Optional)
              </label>
              <input
                value={formData.medical_record_id}
                onChange={(e) => setFormData({ ...formData, medical_record_id: e.target.value })}
                placeholder="Record UUID"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Line Items *</label>
              <button
                type="button"
                onClick={addItemRow}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                + Add Item
              </button>
            </div>
            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-2">
                    <select
                      value={item.item_type}
                      onChange={(e) => handleItemChange(index, 'item_type', e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                    >
                      <option value="service">Service</option>
                      <option value="medicine">Medicine</option>
                    </select>
                  </div>
                  <div className="col-span-4">
                    {item.item_type === 'medicine' ? (
                      <select
                        value={item.inventory_item_id}
                        onChange={(e) => handleItemChange(index, 'inventory_item_id', e.target.value)}
                        className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                      >
                        <option value="">Select Medicine</option>
                        {inventory.map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.name} (Stock: {i.quantity})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        value={item.item_name}
                        onChange={(e) => handleItemChange(index, 'item_name', e.target.value)}
                        placeholder="Service name"
                        className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                      />
                    )}
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                    />
                  </div>
                  <div className="col-span-1 text-right text-sm font-medium text-gray-900 dark:text-white py-2">
                    ${item.total_price.toFixed(2)}
                  </div>
                  <div className="col-span-1">
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItemRow(index)}
                        className="w-full py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Additional billing notes..."
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2 w-full md:w-1/2 ml-auto">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <span className="text-gray-600 dark:text-gray-400">Tax ({(formData.tax_rate * 100).toFixed(0)}%):</span>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={formData.tax_rate}
                onChange={(e) => setFormData({ ...formData, tax_rate: Number(e.target.value) })}
                className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-right text-sm"
              />
              <span className="font-medium w-20 text-right">${tax_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-2">
              <span>Total:</span>
              <span>${total_amount.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/billing')}
              className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-sm flex items-center justify-center"
            >
              {loading ? 'Processing...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceForm;
