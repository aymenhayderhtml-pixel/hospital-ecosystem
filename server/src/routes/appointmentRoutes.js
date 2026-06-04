const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, appointmentController.getAll);
router.post('/', authMiddleware, appointmentController.create);

module.exports = router;
