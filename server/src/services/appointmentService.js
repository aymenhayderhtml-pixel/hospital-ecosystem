const { supabase } = require('../config/supabase');

const appointmentService = {
  async getAll(filters = {}) {
    let query = supabase.from('appointments').select('*');
    if (filters.doctor_id) query = query.eq('doctor_id', filters.doctor_id);
    if (filters.patient_id) query = query.eq('patient_id', filters.patient_id);
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.date) query = query.eq('date', filters.date);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async create(data) {
    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert([data])
      .select()
      .single();
    if (error) throw error;
    return appointment;
  },
};

module.exports = appointmentService;
