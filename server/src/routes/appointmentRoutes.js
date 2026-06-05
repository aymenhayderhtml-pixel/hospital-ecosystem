const express = require('express');
const router = express.Router();

const {
  createAppointment, getAllAppointments, getAppointmentById, updateAppointmentStatus,
} = require('../controllers/appointmentController');

const { protect, authorize } = require('../middleware/authMiddleware');
const { createAppointmentValidation, updateStatusValidation } = require('../validators/appointmentValidator');

// All routes require authentication
router.use(protect);

router.get('/', getAllAppointments);
router.get('/:id', getAppointmentById);

// Admin and receptionist can create appointments
router.post('/', authorize('admin', 'receptionist'), createAppointmentValidation, createAppointment);
// Update status — doctor can confirm/cancel their own, admin/receptionist can do any
router.patch('/:id/status', authorize('admin', 'receptionist', 'doctor'), updateStatusValidation, updateAppointmentStatus);

module.exports = router;
