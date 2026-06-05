const { validationResult } = require('express-validator');
const { supabase } = require('../config/supabase');

const getNextInvoiceNumber = async () => {
  const { data } = await supabase
    .from('invoices')
    .select('invoice_number')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data || !data.invoice_number) return 'INV-0001';

  const match = data.invoice_number.match(/INV-(\d+)/);
  if (match) {
    const nextNum = parseInt(match[1], 10) + 1;
    return `INV-${String(nextNum).padStart(4, '0')}`;
  }
  return 'INV-0001';
};

const createInvoice = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { patient_id, medical_record_id, notes, items, subtotal, tax_amount, total_amount } = req.body;
    const invoice_number = await getNextInvoiceNumber();

    const { data: invoiceId, error } = await supabase.rpc('create_invoice_transaction', {
      p_patient_id: patient_id,
      p_medical_record_id: medical_record_id || null,
      p_invoice_number: invoice_number,
      p_status: 'unpaid',
      p_subtotal: subtotal,
      p_tax_amount: tax_amount,
      p_total_amount: total_amount,
      p_notes: notes || null,
      p_created_by: req.user.id,
      p_items: items,
    });

    if (error) {
      console.error('Create invoice transaction error:', error);
      const msg = error.message && error.message.includes('Insufficient inventory')
        ? error.message
        : 'Failed to create invoice. Please try again.';
      return res.status(400).json({ success: false, message: msg });
    }

    res.status(201).json({ success: true, message: 'Invoice created and inventory updated.', data: { invoice_id: invoiceId } });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const getAllInvoices = async (req, res) => {
  try {
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select(`
        id, invoice_number, status, total_amount, created_at, paid_at,
        patient:patients!inner (id, first_name, last_name, patient_number)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json({ success: true, data: { invoices: invoices || [] } });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *,
        patient:patients!inner (id, first_name, last_name, phone),
        items:invoice_items (
          id, item_type, inventory_item_id, item_name, quantity, unit_price, total_price
        )
      `)
      .eq('id', id)
      .single();

    if (error || !invoice) return res.status(404).json({ success: false, message: 'Invoice not found.' });

    res.status(200).json({ success: true, data: { invoice } });
  } catch (error) {
    console.error('Get invoice by ID error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const updateInvoiceStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    const updateData = { status };
    if (status === 'paid') {
      updateData.paid_at = new Date().toISOString();
    } else if (status === 'cancelled') {
      updateData.paid_at = null;
    }

    const { data: updatedInvoice, error } = await supabase
      .from('invoices')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !updatedInvoice) return res.status(404).json({ success: false, message: 'Invoice not found.' });

    res.status(200).json({ success: true, message: `Invoice marked as ${status}.`, data: { invoice: updatedInvoice } });
  } catch (error) {
    console.error('Update invoice status error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const getInvoicesByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('id, invoice_number, status, total_amount, created_at, paid_at')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json({ success: true, data: { invoices: invoices || [] } });
  } catch (error) {
    console.error('Get patient invoices error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { createInvoice, getAllInvoices, getInvoiceById, updateInvoiceStatus, getInvoicesByPatient };
