const { validationResult } = require('express-validator');
const { supabase } = require('../config/supabase');

/**
 * Book a new appointment
 * POST /api/appointments
 */
const createAppointment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { patient_id, doctor_id, appointment_date, appointment_time, reason, notes } = req.body;

    // 1. Prevent double-booking: check if doctor already has a non-cancelled appointment at this time
    const { data: existingAppt } = await supabase
      .from('appointments')
      .select('id')
      .eq('doctor_id', doctor_id)
      .eq('appointment_date', appointment_date)
      .eq('appointment_time', appointment_time)
      .neq('status', 'cancelled')
      .maybeSingle();

    if (existingAppt) {
      return res.status(409).json({
        success: false,
        message: 'This doctor is already booked at this date and time. Please choose a different time.',
      });
    }

    // 2. Insert appointment
    const { data: newAppt, error } = await supabase
      .from('appointments')
      .insert([{ patient_id, doctor_id, appointment_date, appointment_time, reason, notes }])
      .select(`
        id, appointment_date, appointment_time, reason, status, notes, created_at,
        patient:patients!inner (id, first_name, last_name, phone),
        doctor:doctors!inner (id, name, specialty)
      `)
      .single();

    if (error) {
      console.error('Create appointment error:', error);
      return res.status(500).json({ success: false, message: 'Failed to book appointment.' });
    }

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully.',
      data: { appointment: newAppt },
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * Get all appointments (with optional filters)
 * GET /api/appointments?doctor_id=xxx&date=yyyy-mm-dd
 */
const getAllAppointments = async (req, res) => {
  try {
    const { doctor_id, date, page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabase
      .from('appointments')
      .select(`
        id, appointment_date, appointment_time, reason, status, notes, created_at,
        patient:patients!inner (id, first_name, last_name, phone),
        doctor:doctors!inner (id, name, specialty)
      `, { count: 'exact' });

    if (doctor_id) {
      query = query.eq('doctor_id', doctor_id);
    }

    if (date) {
      query = query.eq('appointment_date', date);
    }

    // Role-based filtering: doctors see only their own appointments
    if (req.user.role === 'doctor') {
      const { data: doctorProfile } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', req.user.id)
        .single();

      if (doctorProfile) {
        query = query.eq('doctor_id', doctorProfile.id);
      } else {
        return res.status(403).json({ success: false, message: 'Doctor profile not found.' });
      }
    }

    const { data: appointments, error, count } = await query
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) {
      console.error('Get appointments error:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch appointments.' });
    }

    res.status(200).json({
      success: true,
      data: {
        appointments,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get all appointments error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * Get single appointment by ID
 * GET /api/appointments/:id
 */
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: appt, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patients!inner (id, first_name, last_name, phone, date_of_birth),
        doctor:doctors!inner (id, name, specialty, phone)
      `)
      .eq('id', id)
      .single();

    if (error || !appt) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    // Role check: doctors can only view their own appointments
    if (req.user.role === 'doctor') {
      const { data: doctorProfile } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', req.user.id)
        .single();

      if (appt.doctor_id !== doctorProfile?.id) {
        return res.status(403).json({ success: false, message: 'Access denied.' });
      }
    }

    res.status(200).json({ success: true, data: { appointment: appt } });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * Update appointment status
 * PATCH /api/appointments/:id/status
 */
const updateAppointmentStatus = async (req, res) => {
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

    const { data: updatedAppt, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)
      .select(`
        id, appointment_date, appointment_time, reason, status, notes,
        patient:patients!inner (id, first_name, last_name),
        doctor:doctors!inner (id, name, specialty)
      `)
      .single();

    if (error || !updatedAppt) {
      return res.status(404).json({ success: false, message: 'Appointment not found or update failed.' });
    }

    res.status(200).json({
      success: true,
      message: `Appointment ${status} successfully.`,
      data: { appointment: updatedAppt },
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { createAppointment, getAllAppointments, getAppointmentById, updateAppointmentStatus };
