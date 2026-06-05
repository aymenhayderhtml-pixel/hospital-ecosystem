const express = require('express');
const router = express.Router();

const {
  createInventory, getAllInventory, getInventoryById, getInventoryAlerts, updateInventory, deleteInventory,
} = require('../controllers/inventoryController');

const { protect, authorize } = require('../middleware/authMiddleware');
const { createInventoryValidation, updateInventoryValidation } = require('../validators/inventoryValidator');

router.use(protect);

// Specific routes MUST come before parameterized routes
router.get('/alerts', getInventoryAlerts);

router.get('/', getAllInventory);
router.get('/:id', getInventoryById);

// Admin-only mutations
router.post('/', authorize('admin'), createInventoryValidation, createInventory);
router.put('/:id', authorize('admin'), updateInventoryValidation, updateInventory);
router.delete('/:id', authorize('admin'), deleteInventory);

module.exports = router;
