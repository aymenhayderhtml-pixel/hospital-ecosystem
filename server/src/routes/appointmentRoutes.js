const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, appointmentController.getAll);
router.post('/', protect, appointmentController.create);

module.exports = router;
