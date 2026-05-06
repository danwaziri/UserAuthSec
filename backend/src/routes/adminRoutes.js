const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, authorize } = require('../middleware/auth');

// All admin routes require authentication and 'admin' role
router.use(auth);
router.use(authorize('admin'));

// GET /api/v1/admin/stats
router.get('/stats', adminController.getDashboardStats);

// GET /api/v1/admin/users
router.get('/users', adminController.getUsers);

// GET /api/v1/admin/users/:userId/security
router.get('/users/:userId/security', adminController.getUserSecurityDetails);

// PUT /api/v1/admin/users/:userId/status
router.put('/users/:userId/status', adminController.toggleUserStatus);

module.exports = router;
