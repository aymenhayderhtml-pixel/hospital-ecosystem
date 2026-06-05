const { supabase } = require('../config/supabase');

/**
 * Get all doctors
 * GET /api/doctors
 */
const getAllDoctors = async (req, res) => {
  try {
    const { specialty, page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabase
      .from('doctors')
      .select('id, name, specialty, phone, available_days, user_id', { count: 'exact' });

    if (specialty) {
      query = query.eq('specialty', specialty);
    }

    const { data: doctors, error, count } = await query
      .order('name', { ascending: true })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) {
      console.error('Get doctors error:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch doctors.' });
    }

    res.status(200).json({
      success: true,
      data: {
        doctors,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get all doctors error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * Get doctor by ID
 * GET /api/doctors/:id
 */
const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: doctor, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    // Get upcoming appointments count
    const { count: upcomingAppointments } = await supabase
      .from('appointments')
      .select('id', { count: 'exact', head: true })
      .eq('doctor_id', id)
      .gte('appointment_date', new Date().toISOString().split('T')[0])
      .neq('status', 'cancelled');

    res.status(200).json({
      success: true,
      data: {
        doctor: { ...doctor, upcoming_appointments: upcomingAppointments },
      },
    });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { getAllDoctors, getDoctorById };
