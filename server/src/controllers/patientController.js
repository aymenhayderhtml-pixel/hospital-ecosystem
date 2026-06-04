const { validationResult } = require('express-validator');
const { supabase } = require('../config/supabase');

const createPatient = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const {
      first_name, last_name, date_of_birth, gender, phone,
      email, blood_type, address, emergency_contact_name, emergency_contact_phone,
    } = req.body;

    const { data: existingPatient, error: lookupError } = await supabase
      .from('patients')
      .select('id, patient_number')
      .or(`phone.eq.${phone}${email ? `,email.eq.${email}` : ''}`)
      .maybeSingle();

    if (lookupError) {
      console.error('Database lookup error:', lookupError);
      return res.status(500).json({ success: false, message: 'Database error. Please try again later.' });
    }

    if (existingPatient) {
      return res.status(409).json({
        success: false,
        message: 'A patient with this phone number or email already exists.',
        data: { patient_number: existingPatient.patient_number },
      });
    }

    const { data: newPatient, error: insertError } = await supabase
      .from('patients')
      .insert([{
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        date_of_birth,
        gender,
        phone: phone.trim(),
        email: email ? email.toLowerCase().trim() : null,
        blood_type: blood_type || 'unknown',
        address: address ? address.trim() : null,
        emergency_contact_name: emergency_contact_name ? emergency_contact_name.trim() : null,
        emergency_contact_phone: emergency_contact_phone ? emergency_contact_phone.trim() : null,
        created_by: req.user.id,
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Patient creation error:', insertError);
      return res.status(500).json({ success: false, message: 'Failed to create patient. Please try again.' });
    }

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully.',
      data: { patient: newPatient },
    });
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const getAllPatients = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabase
      .from('patients')
      .select('id, patient_number, first_name, last_name, phone, email, gender, created_at', { count: 'exact' });

    if (search && search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      query = query.or(
        `first_name.ilike.%${searchTerm}%,` +
        `last_name.ilike.%${searchTerm}%,` +
        `patient_number.ilike.%${searchTerm}%,` +
        `phone.ilike.%${searchTerm}%,` +
        `email.ilike.%${searchTerm}%`
      );
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + parseInt(limit) - 1);

    const { data: patients, error, count } = await query;

    if (error) {
      console.error('Get patients error:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch patients.' });
    }

    res.status(200).json({
      success: true,
      data: {
        patients,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get all patients error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ success: false, message: 'Invalid patient ID format.' });
    }

    const { data: patient, error } = await supabase
      .from('patients')
      .select(`*, created_by_user:created_by (id, name, email)`)
      .eq('id', id)
      .single();

    if (error || !patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    const age = calculateAge(patient.date_of_birth);

    res.status(200).json({
      success: true,
      data: {
        patient: {
          ...patient,
          age,
          full_name: `${patient.first_name} ${patient.last_name}`,
        },
      },
    });
  } catch (error) {
    console.error('Get patient by ID error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { data: existingPatient, error: lookupError } = await supabase
      .from('patients')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (lookupError || !existingPatient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    const updateData = {};
    const allowedFields = [
      'first_name', 'last_name', 'date_of_birth', 'gender', 'phone',
      'email', 'blood_type', 'address', 'emergency_contact_name', 'emergency_contact_phone',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = typeof req.body[field] === 'string' ? req.body[field].trim() : req.body[field];
      }
    });

    if (updateData.email) {
      updateData.email = updateData.email.toLowerCase();
    }

    if (updateData.phone || updateData.email) {
      let duplicateQuery = supabase.from('patients').select('id, patient_number').neq('id', id);
      const orConditions = [];
      if (updateData.phone) orConditions.push(`phone.eq.${updateData.phone}`);
      if (updateData.email) orConditions.push(`email.eq.${updateData.email}`);

      if (orConditions.length > 0) {
        duplicateQuery = duplicateQuery.or(orConditions.join(','));
        const { data: duplicate } = await duplicateQuery.maybeSingle();
        if (duplicate) {
          return res.status(409).json({
            success: false,
            message: 'Another patient with this phone number or email already exists.',
          });
        }
      }
    }

    const { data: updatedPatient, error: updateError } = await supabase
      .from('patients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Update patient error:', updateError);
      return res.status(500).json({ success: false, message: 'Failed to update patient.' });
    }

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully.',
      data: { patient: updatedPatient },
    });
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

module.exports = { createPatient, getAllPatients, getPatientById, updatePatient };
