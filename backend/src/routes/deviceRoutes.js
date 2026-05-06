const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const { auth } = require('../middleware/auth');

// All device routes require authentication
router.use(auth);

// GET /api/v1/devices
router.get('/', deviceController.getUserDevices);

// PUT /api/v1/devices/:deviceId/trust
router.put('/:deviceId/trust', deviceController.toggleDeviceTrust);

// DELETE /api/v1/devices/:deviceId
router.delete('/:deviceId', deviceController.deleteDevice);

module.exports = router;
