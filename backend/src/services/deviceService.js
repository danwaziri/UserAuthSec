const { Device } = require('../models');

/**
 * Service for device-related operations
 */
class DeviceService {
    /**
     * Recognize or create a device based on fingerprint and user agent
     * @param {number} userId 
     * @param {string} fingerprint 
     * @param {string} userAgent 
     * @returns {Promise<Device>}
     */
    static async recognizeDevice(userId, fingerprint, userAgent) {
        if (!fingerprint) return null;

        // Extract basic info from User Agent (simplified)
        const browser = userAgent.includes('Chrome') ? 'Chrome' :
            userAgent.includes('Firefox') ? 'Firefox' :
                userAgent.includes('Safari') ? 'Safari' : 'Unknown';

        const os = userAgent.includes('Windows') ? 'Windows' :
            userAgent.includes('Mac') ? 'MacOS' :
                userAgent.includes('Linux') ? 'Linux' :
                    userAgent.includes('Android') ? 'Android' :
                        userAgent.includes('iPhone') ? 'iOS' : 'Unknown';

        const [device, created] = await Device.findOrCreate({
            where: {
                user_id: userId,
                device_fingerprint: fingerprint
            },
            defaults: {
                device_name: `${browser} on ${os}`,
                browser,
                os,
                last_used_at: new Date()
            }
        });

        if (!created) {
            await device.update({ last_used_at: new Date() });
        }

        return device;
    }

    /**
     * Check if a device is trusted by the user
     * @param {number} deviceId 
     * @returns {Promise<boolean>}
     */
    static async isTrusted(deviceId) {
        if (!deviceId) return false;
        const device = await Device.findByPk(deviceId);
        return device ? device.is_trusted : false;
    }
}

module.exports = DeviceService;
