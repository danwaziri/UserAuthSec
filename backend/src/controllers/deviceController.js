const { Device } = require('../models');

/**
 * Get all devices for the authenticated user
 */
exports.getUserDevices = async (req, res, next) => {
    try {
        const devices = await Device.findAll({
            where: { user_id: req.user.id },
            order: [['last_used_at', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: devices
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Trust or untrust a device
 */
exports.toggleDeviceTrust = async (req, res, next) => {
    try {
        const { deviceId } = req.params;
        const { isTrusted } = req.body;

        const device = await Device.findOne({
            where: { id: deviceId, user_id: req.user.id }
        });

        if (!device) {
            return res.status(404).json({ success: false, message: 'Device not found' });
        }

        await device.update({ is_trusted: isTrusted });

        res.status(200).json({
            success: true,
            message: `Device updated to ${isTrusted ? 'trusted' : 'untrusted'}`,
            data: device
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete a device record (unrecognize)
 */
exports.deleteDevice = async (req, res, next) => {
    try {
        const { deviceId } = req.params;

        const device = await Device.findOne({
            where: { id: deviceId, user_id: req.user.id }
        });

        if (!device) {
            return res.status(404).json({ success: false, message: 'Device not found' });
        }

        await device.destroy();

        res.status(200).json({
            success: true,
            message: 'Device removed successfully'
        });
    } catch (error) {
        next(error);
    }
};
