const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { supabase } = require('../config/supabase');

const getUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, role, is_active, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json({ success: true, data: { users: users || [] } });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { name, email, password, role } = req.body;

    const { data: existing } = await supabase.from('users').select('id').eq('email', email.toLowerCase().trim()).maybeSingle();
    if (existing) return res.status(409).json({ success: false, message: 'Email already in use.' });

    const hashedPassword = await bcrypt.hash(password, 12);

    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{ name: name.trim(), email: email.toLowerCase().trim(), password: hashedPassword, role }])
      .select('id, name, email, role, created_at')
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, message: 'User created successfully.', data: { user: newUser } });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { id } = req.params;
    const { role } = req.body;

    if (id === req.user.id && role !== 'admin') {
      return res.status(400).json({ success: false, message: 'You cannot change your own admin role.' });
    }

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', id)
      .select('id, name, email, role')
      .single();

    if (error || !updatedUser) return res.status(404).json({ success: false, message: 'User not found.' });
    res.status(200).json({ success: true, message: 'Role updated.', data: { user: updatedUser } });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
    }

    const { error } = await supabase.from('users').delete().eq('id', id);

    if (error) {
      console.error('Delete user error:', error);
      return res.status(500).json({ success: false, message: 'Failed to delete user.' });
    }

    res.status(200).json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const getHospitalInfo = async (req, res) => {
  try {
    const { data: settings, error } = await supabase
      .from('hospital_settings')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    res.status(200).json({ success: true, data: { settings: settings || {} } });
  } catch (error) {
    console.error('Get hospital info error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const updateHospitalInfo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const updateData = { ...req.body };

    const { data: existing } = await supabase.from('hospital_settings').select('id').limit(1).maybeSingle();

    let result;
    if (existing) {
      result = await supabase.from('hospital_settings').update({ ...updateData, updated_at: new Date().toISOString() }).eq('id', existing.id).select().single();
    } else {
      result = await supabase.from('hospital_settings').insert([updateData]).select().single();
    }

    if (result.error) throw result.error;

    res.status(200).json({ success: true, message: 'Hospital info updated.', data: { settings: result.data } });
  } catch (error) {
    console.error('Update hospital info error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { name, email } = req.body;

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({ name: name.trim(), email: email.toLowerCase().trim() })
      .eq('id', req.user.id)
      .select('id, name, email, role')
      .single();

    if (error) throw error;
    res.status(200).json({ success: true, message: 'Profile updated.', data: { user: updatedUser } });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { current_password, new_password } = req.body;

    const { data: dbUser, error: fetchError } = await supabase
      .from('users')
      .select('password')
      .eq('id', req.user.id)
      .single();

    if (fetchError || !dbUser) return res.status(404).json({ success: false, message: 'User not found.' });

    const isValid = await bcrypt.compare(current_password, dbUser.password);
    if (!isValid) return res.status(401).json({ success: false, message: 'Current password is incorrect.' });

    const hashedNewPassword = await bcrypt.hash(new_password, 12);
    const { error: updateError } = await supabase.from('users').update({ password: hashedNewPassword }).eq('id', req.user.id);

    if (updateError) throw updateError;

    res.status(200).json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { getUsers, createUser, updateUserRole, deleteUser, getHospitalInfo, updateHospitalInfo, updateProfile, changePassword };
