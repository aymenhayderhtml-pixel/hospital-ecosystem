const express = require('express');
const router = express.Router();

const { getAllDoctors, getDoctorById } = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);

module.exports = router;
