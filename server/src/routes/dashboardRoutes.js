const express = require('express');
const router = express.Router();

const { getDashboardStats, getAppointmentsChart, getTopDiagnoses, getHospitalSummary } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/appointments-chart', getAppointmentsChart);
router.get('/top-diagnoses', getTopDiagnoses);
router.get('/hospital-summary', getHospitalSummary);

module.exports = router;
