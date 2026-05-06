const GeoIPService = require('./geoIPService');
const DeviceService = require('./deviceService');
const { LoginAttempt } = require('../models');

/**
 * Service to handle authentication context and risk assessment groundwork
 */
class ContextService {
    /**
     * Capture context for a login attempt
     * @param {Object} req - Express request object
     * @param {Object} user - User record
     * @param {string} fingerprint - Device fingerprint from frontend
     * @returns {Promise<Object>} - Context data
     */
    static async captureContext(req, user, fingerprint) {
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];

        // 1. Get Geolocation
        const geolocation = await GeoIPService.lookup(ip);

        // 2. Recognize Device
        const device = await DeviceService.recognizeDevice(user.id, fingerprint, userAgent);

        return {
            ip,
            userAgent,
            geolocation,
            device
        };
    }

    /**
     * Log a login attempt with its context
     * @param {Object} params 
     */
    static async logAttempt({ userId, deviceId, email, ip, geolocation, status, riskScore = 0, riskLevel = 'LOW', mfaRequired = false }) {
        return await LoginAttempt.create({
            user_id: userId,
            device_id: deviceId,
            email: email || 'unknown',
            ip_address: ip,
            country: geolocation?.country,
            city: geolocation?.city,
            latitude: geolocation?.lat,
            longitude: geolocation?.lon,
            status: status.toLowerCase(),
            risk_score: riskScore,
            risk_level: riskLevel,
            mfa_required: mfaRequired
        });
    }

    /**
     * Get recent login history for behavioral analysis
     * @param {number} userId 
     * @param {number} limit 
     */
    static async getRecentHistory(userId, limit = 10) {
        return await LoginAttempt.findAll({
            where: { user_id: userId, status: 'success' },
            order: [['attempted_at', 'DESC']],
            limit
        });
    }
}

module.exports = ContextService;
