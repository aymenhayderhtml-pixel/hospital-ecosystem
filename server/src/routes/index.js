const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/patients', require('./patientRoutes'));
router.use('/appointments', require('./appointmentRoutes'));
router.use('/doctors', require('./doctorRoutes'));
router.use('/records', require('./recordRoutes'));
router.use('/inventory', require('./inventoryRoutes'));
router.use('/dashboard', require('./dashboardRoutes'));
router.use('/settings', require('./settingsRoutes'));
router.use('/billing', require('./billingRoutes'));

module.exports = router;
