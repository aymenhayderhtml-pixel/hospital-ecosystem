const { supabase } = require('./supabase');

/**
 * Test database connection and export utility functions.
 */

async function testConnection() {
  try {
    const { data, error } = await supabase.from('_test').select('*').limit(1);
    if (error && error.code === '42P01') {
      // Table doesn't exist yet — connection works, no tables created
      return true;
    }
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Database connection test failed:', err.message);
    return false;
  }
}

module.exports = { testConnection };
