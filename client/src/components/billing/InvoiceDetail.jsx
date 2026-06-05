import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { billingService } from '../../services/billingService';

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const res = await billingService.getById(id);
      setInvoice(res.data.data.invoice);
    } catch (error) {
      alert('Failed to load invoice.');
      navigate('/billing');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!window.confirm(`Mark this invoice as ${newStatus}?`)) return;
    setUpdating(true);
    try {
      await billingService.updateStatus(id, newStatus);
      fetchInvoice();
    } catch (error) {
      alert('Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading invoice...</div>;
  if (!invoice) return <div className="p-8 text-center text-red-600">Invoice not found.</div>;

  const StatusBadge = ({ status }) => {
    const colors = {
      unpaid: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      paid: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    };
    return (
      <span className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${colors[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/billing')}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white mb-4"
      >
        ← Back to Invoices
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-700 px-8 py-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoice {invoice.invoice_number}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Date: {new Date(invoice.created_at).toLocaleDateString()}
            </p>
            {invoice.paid_at && (
              <p className="text-green-600 text-sm mt-1">
                Paid on: {new Date(invoice.paid_at).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="text-right space-y-3">
            <StatusBadge status={invoice.status} />
            {invoice.status === 'unpaid' && (
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => handleStatusChange('paid')}
                  disabled={updating}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50"
                >
                  Mark as Paid
                </button>
                <button
                  onClick={() => handleStatusChange('cancelled')}
                  disabled={updating}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Billed To</h3>
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            {invoice.patient.first_name} {invoice.patient.last_name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Patient ID: {invoice.patient.patient_number}</p>
          {invoice.patient.phone && (
            <p className="text-sm text-gray-600 dark:text-gray-400">Phone: {invoice.patient.phone}</p>
          )}
        </div>

        <div className="px-8 py-6">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase pb-3">Description</th>
                <th className="text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase pb-3">Qty</th>
                <th className="text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase pb-3">Unit Price</th>
                <th className="text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase pb-3">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 text-sm text-gray-900 dark:text-white">
                    {item.item_name}
                    <span className="block text-xs text-gray-500 dark:text-gray-400 capitalize">{item.item_type}</span>
                  </td>
                  <td className="py-3 text-sm text-gray-900 dark:text-white text-right">{item.quantity}</td>
                  <td className="py-3 text-sm text-gray-900 dark:text-white text-right">
                    ${Number(item.unit_price).toFixed(2)}
                  </td>
                  <td className="py-3 text-sm font-medium text-gray-900 dark:text-white text-right">
                    ${Number(item.total_price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium">${Number(invoice.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                <span className="font-medium">${Number(invoice.tax_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-2">
                <span>Total</span>
                <span>${Number(invoice.total_amount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Notes</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
