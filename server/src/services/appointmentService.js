const { supabase } = require('../config/supabase');

const APPOINTMENT_SELECT = `
  id, appointment_date, appointment_time, reason, status, notes, created_at,
  patient:patients!inner (id, first_name, last_name, phone),
  doctor:doctors!inner (id, name, specialty, phone)
`;

const appointmentService = {
  async getAll(filters = {}) {
    let query = supabase
      .from('appointments')
      .select(APPOINTMENT_SELECT, { count: 'exact' });

    if (filters.doctor_id) query = query.eq('doctor_id', filters.doctor_id);
    if (filters.patient_id) query = query.eq('patient_id', filters.patient_id);
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.date) query = query.eq('appointment_date', filters.date);

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 50;
    const offset = (page - 1) * limit;

    const { data, error, count } = await query
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { appointments: data, count, page, limit, totalPages: Math.ceil(count / limit) };
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('appointments')
      .select(APPOINTMENT_SELECT)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(data) {
    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert([data])
      .select(APPOINTMENT_SELECT)
      .single();

    if (error) throw error;
    return appointment;
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)
      .select(APPOINTMENT_SELECT)
      .single();

    if (error) throw error;
    return data;
  },
};

module.exports = appointmentService;
