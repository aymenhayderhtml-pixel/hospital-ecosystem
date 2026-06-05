const { validationResult } = require('express-validator');
const { supabase } = require('../config/supabase');

/**
 * Add new inventory item
 * POST /api/inventory
 */
const createInventory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { name, category, quantity, unit, min_quantity, unit_price, supplier_name, expiry_date } = req.body;

    const { data: newItem, error } = await supabase
      .from('inventory')
      .insert([{
        name, category, quantity, unit, min_quantity, unit_price,
        supplier_name: supplier_name || null,
        expiry_date: expiry_date || null,
      }])
      .select()
      .single();

    if (error) {
      console.error('Create inventory error:', error);
      return res.status(500).json({ success: false, message: 'Failed to add inventory item.' });
    }

    res.status(201).json({ success: true, message: 'Inventory item added successfully.', data: { item: newItem } });
  } catch (error) {
    console.error('Create inventory error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * Get all inventory items with optional search and category filter
 * GET /api/inventory
 */
const getAllInventory = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabase.from('inventory').select('*', { count: 'exact' });

    if (search) {
      query = query.ilike('name', `%${search.trim()}%`);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data: items, error, count } = await query
      .order('name', { ascending: true })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) {
      console.error('Get inventory error:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch inventory.' });
    }

    res.status(200).json({
      success: true,
      data: {
        items,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get all inventory error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * Get inventory item by ID
 * GET /api/inventory/:id
 */
const getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: item, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found.' });
    }

    res.status(200).json({ success: true, data: { item } });
  } catch (error) {
    console.error('Get inventory item error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * Get inventory alerts (Low stock OR expiring within 30 days)
 * GET /api/inventory/alerts
 */
const getInventoryAlerts = async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    const expiryThreshold = thirtyDaysFromNow.toISOString().split('T')[0];

    const { data: alerts, error } = await supabase
      .from('inventory')
      .select('*')
      .or(`quantity.lt.min_quantity,expiry_date.lte.${expiryThreshold}`)
      .order('expiry_date', { ascending: true, nullsLast: true });

    if (error) {
      console.error('Get inventory alerts error:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch inventory alerts.' });
    }

    const lowStock = alerts.filter((item) => item.quantity < item.min_quantity);
    const expiringSoon = alerts.filter((item) => item.expiry_date && item.expiry_date <= expiryThreshold);

    res.status(200).json({
      success: true,
      data: {
        lowStock,
        expiringSoon,
        totalAlerts: alerts.length,
      },
    });
  } catch (error) {
    console.error('Get inventory alerts error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * Update inventory item
 * PUT /api/inventory/:id
 */
const updateInventory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { id } = req.params;
    const updateData = {};
    const allowedFields = ['name', 'category', 'quantity', 'unit', 'min_quantity', 'unit_price', 'supplier_name', 'expiry_date'];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field] === '' ? null : req.body[field];
      }
    });

    const { data: updatedItem, error } = await supabase
      .from('inventory')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !updatedItem) {
      return res.status(404).json({ success: false, message: 'Inventory item not found or update failed.' });
    }

    res.status(200).json({ success: true, message: 'Inventory item updated successfully.', data: { item: updatedItem } });
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * Delete inventory item
 * DELETE /api/inventory/:id
 */
const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from('inventory').delete().eq('id', id);

    if (error) {
      return res.status(404).json({ success: false, message: 'Inventory item not found or deletion failed.' });
    }

    res.status(200).json({ success: true, message: 'Inventory item deleted successfully.' });
  } catch (error) {
    console.error('Delete inventory error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { createInventory, getAllInventory, getInventoryById, getInventoryAlerts, updateInventory, deleteInventory };
