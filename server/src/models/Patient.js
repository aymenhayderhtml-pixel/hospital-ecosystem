const { supabase } = require('../config/supabase');

class Patient {
  static table = 'patients';

  static async findAll(filters = {}) {
    let query = supabase.from(this.table).select('*');
    if (filters.doctor_id) query = query.eq('doctor_id', filters.doctor_id);
    if (filters.status) query = query.eq('status', filters.status);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  static async create(patientData) {
    const { data, error } = await supabase
      .from(this.table)
      .insert([patientData])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async update(id, updates) {
    const { data, error } = await supabase
      .from(this.table)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { error } = await supabase
      .from(this.table)
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }
}

module.exports = Patient;
