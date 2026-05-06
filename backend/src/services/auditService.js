const { AdminLog } = require('../models');

/**
 * Service for security auditing and admin notifications
 */
class AuditService {
    /**
     * Log a security incident for admin review
     */
    static async logSecurityAlert(userId, action, details) {
        try {
            console.warn(`[SECURITY ALERT] User ${userId}: ${action}`, details);

            return await AdminLog.create({
                action: `SECURITY_ALERT: ${action}`,
                target_user_id: userId,
                details
            });
        } catch (error) {
            console.error('Failed to log security alert:', error);
        }
    }

    /**
     * Log an admin action
     */
    static async logAdminAction(adminId, action, targetUserId, details) {
        return await AdminLog.create({
            admin_id: adminId,
            action,
            target_user_id: targetUserId,
            details
        });
    }
}

module.exports = AuditService;
