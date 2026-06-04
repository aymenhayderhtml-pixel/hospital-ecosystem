const { supabase } = require('../config/supabase');

class User {
  static table = 'users';

  static async findByEmail(email) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('email', email)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
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

  static async create(userData) {
    const { data, error } = await supabase
      .from(this.table)
      .insert([userData])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

module.exports = User;
