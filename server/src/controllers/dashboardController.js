const { supabase } = require('../config/supabase');

/**
 * Get live dashboard statistics
 * GET /api/dashboard/stats
 */
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { count: total_patients } = await supabase
      .from('patients').select('*', { count: 'exact', head: true });

    const { count: doctors_count } = await supabase
      .from('doctors').select('*', { count: 'exact', head: true });

    const { count: appointments_today } = await supabase
      .from('appointments').select('*', { count: 'exact', head: true })
      .eq('appointment_date', today);

    const { count: pending_appointments } = await supabase
      .from('appointments').select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: low_stock_count } = await supabase
      .from('inventory').select('*', { count: 'exact', head: true })
      .or(`quantity.lt.min_quantity,expiry_date.lte.${thirtyDaysFromNow}`);

    res.status(200).json({
      success: true,
      data: {
        total_patients: total_patients || 0,
        doctors_count: doctors_count || 0,
        appointments_today: appointments_today || 0,
        pending_appointments: pending_appointments || 0,
        low_stock_count: low_stock_count || 0,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * Get appointments count per day for the last 7 days
 * GET /api/dashboard/appointments-chart
 */
const getAppointmentsChart = async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('appointments')
      .select('appointment_date')
      .gte('appointment_date', sevenDaysAgo);

    if (error) throw error;

    const counts = {};
    data.forEach((appt) => {
      counts[appt.appointment_date] = (counts[appt.appointment_date] || 0) + 1;
    });

    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

      chartData.push({
        date: dateStr,
        day: dayName,
        count: counts[dateStr] || 0,
      });
    }

    res.status(200).json({ success: true, data: chartData });
  } catch (error) {
    console.error('Get appointments chart error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * Get top 5 most common diagnoses
 * GET /api/dashboard/top-diagnoses
 */
const getTopDiagnoses = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('medical_records')
      .select('diagnosis')
      .order('created_at', { ascending: false })
      .limit(500);

    if (error) throw error;

    const counts = {};
    data.forEach((record) => {
      const diag = record.diagnosis.trim();
      if (diag) counts[diag] = (counts[diag] || 0) + 1;
    });

    const topDiagnoses = Object.entries(counts)
      .map(([diagnosis, count]) => ({ diagnosis, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.status(200).json({ success: true, data: topDiagnoses });
  } catch (error) {
    console.error('Get top diagnoses error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * Get hospital bed summary
 * GET /api/dashboard/hospital-summary
 */
const getHospitalSummary = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const TOTAL_BEDS = 150;

    const { count: occupied_beds } = await supabase
      .from('appointments').select('*', { count: 'exact', head: true })
      .eq('appointment_date', today)
      .eq('status', 'confirmed');

    res.status(200).json({
      success: true,
      data: {
        total_beds: TOTAL_BEDS,
        occupied_beds: occupied_beds || 0,
        available_beds: TOTAL_BEDS - (occupied_beds || 0),
      },
    });
  } catch (error) {
    console.error('Get hospital summary error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { getDashboardStats, getAppointmentsChart, getTopDiagnoses, getHospitalSummary };
