const { validationResult } = require('express-validator');
const { supabase } = require('../config/supabase');

/**
 * Create a new medical record
 * POST /api/records
 */
const createRecord = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { patient_id, doctor_id, appointment_id, visit_date, diagnosis, symptoms, prescription, notes, follow_up_date } = req.body;

    const { data: newRecord, error } = await supabase
      .from('medical_records')
      .insert([{
        patient_id,
        doctor_id,
        appointment_id: appointment_id || null,
        visit_date: visit_date || new Date().toISOString().split('T')[0],
        diagnosis,
        symptoms,
        prescription: prescription || null,
        notes: notes || null,
        follow_up_date: follow_up_date || null,
      }])
      .select(`
        id, visit_date, diagnosis, symptoms, prescription, notes, follow_up_date, created_at,
        doctor:doctors!inner (id, name, specialty),
        patient:patients!inner (id, first_name, last_name)
      `)
      .single();

    if (error) {
      console.error('Create record error:', error);
      return res.status(500).json({ success: false, message: 'Failed to create medical record.' });
    }

    res.status(201).json({ success: true, message: 'Medical record created successfully.', data: { record: newRecord } });
  } catch (error) {
    console.error('Create record error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * Get all records for a specific patient (Visit History)
 * GET /api/records/patient/:patientId
 */
const getRecordsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const { data: records, error } = await supabase
      .from('medical_records')
      .select(`
        id, visit_date, diagnosis, symptoms, prescription, notes, follow_up_date, created_at,
        doctor:doctors!inner (id, name, specialty)
      `)
      .eq('patient_id', patientId)
      .order('visit_date', { ascending: false });

    if (error) {
      console.error('Get patient records error:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch patient records.' });
    }

    res.status(200).json({ success: true, data: { records } });
  } catch (error) {
    console.error('Get patient records error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * Get a single medical record in full detail
 * GET /api/records/:id
 */
const getRecordById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: record, error } = await supabase
      .from('medical_records')
      .select(`
        id, visit_date, diagnosis, symptoms, prescription, notes, follow_up_date, created_at,
        doctor:doctors!inner (id, name, specialty, phone),
        patient:patients!inner (id, first_name, last_name, date_of_birth, phone),
        appointment:appointments (id, appointment_date, appointment_time, reason)
      `)
      .eq('id', id)
      .single();

    if (error || !record) {
      return res.status(404).json({ success: false, message: 'Medical record not found.' });
    }

    res.status(200).json({ success: true, data: { record } });
  } catch (error) {
    console.error('Get record by ID error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * Edit a medical record
 * PUT /api/records/:id
 */
const updateRecord = async (req, res) => {
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
    const allowedFields = ['appointment_id', 'visit_date', 'diagnosis', 'symptoms', 'prescription', 'notes', 'follow_up_date'];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field] === '' ? null : req.body[field];
      }
    });

    const { data: updatedRecord, error } = await supabase
      .from('medical_records')
      .update(updateData)
      .eq('id', id)
      .select(`
        id, visit_date, diagnosis, symptoms, prescription, notes, follow_up_date, created_at,
        doctor:doctors!inner (id, name, specialty),
        patient:patients!inner (id, first_name, last_name)
      `)
      .single();

    if (error || !updatedRecord) {
      return res.status(404).json({ success: false, message: 'Medical record not found or update failed.' });
    }

    res.status(200).json({ success: true, message: 'Medical record updated successfully.', data: { record: updatedRecord } });
  } catch (error) {
    console.error('Update record error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { createRecord, getRecordsByPatient, getRecordById, updateRecord };
