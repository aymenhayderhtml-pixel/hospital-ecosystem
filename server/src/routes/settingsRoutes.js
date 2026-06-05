const express = require('express');
const router = express.Router();

const {
  getUsers, createUser, updateUserRole, deleteUser,
  getHospitalInfo, updateHospitalInfo,
  updateProfile, changePassword,
} = require('../controllers/settingsController');

const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createUserValidation, updateUserRoleValidation, updateHospitalValidation,
  updateProfileValidation, changePasswordValidation,
} = require('../validators/settingsValidator');

router.use(protect);

// User Management (Admin Only)
router.get('/users', authorize('admin'), getUsers);
router.post('/users', authorize('admin'), createUserValidation, createUser);
router.patch('/users/:id/role', authorize('admin'), updateUserRoleValidation, updateUserRole);
router.delete('/users/:id', authorize('admin'), deleteUser);

// Hospital Info
router.get('/hospital', getHospitalInfo);
router.put('/hospital', authorize('admin'), updateHospitalValidation, updateHospitalInfo);

// My Profile
router.patch('/profile', updateProfileValidation, updateProfile);
router.patch('/password', changePasswordValidation, changePassword);

module.exports = router;
