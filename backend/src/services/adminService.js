const { User, LoginAttempt, Device, AdminLog, Session, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * Service for administrative and analytics data
 */
class AdminService {
    /**
     * Get global security statistics
     */
    static async getSecurityStats() {
        const totalUsers = await User.count();
        const activeSessions = await Session.count();

        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentAttempts = await LoginAttempt.count({
            where: { createdAt: { [Op.gte]: last24h } }
        });

        const blockedAttempts = await LoginAttempt.count({
            where: {
                status: 'BLOCKED',
                createdAt: { [Op.gte]: last24h }
            }
        });

        const riskDistribution = await LoginAttempt.findAll({
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            where: { createdAt: { [Op.gte]: last24h } },
            group: ['status']
        });

        return {
            totalUsers,
            activeSessions,
            recentAttempts,
            blockedAttempts,
            riskDistribution
        };
    }

    /**
     * Get recent high-risk activity logs
     */
    static async getSecurityAlerts(limit = 20) {
        return await AdminLog.findAll({
            where: { action: { [Op.like]: 'SECURITY_ALERT%' } },
            include: [
                { model: User, as: 'TargetUser', attributes: ['id', 'email', 'full_name'] }
            ],
            order: [['createdAt', 'DESC']],
            limit
        });
    }

    /**
     * Get all users with their risk summary
     */
    static async getUsersOverview() {
        return await User.findAll({
            attributes: ['id', 'email', 'full_name', 'role', 'is_active', 'mfa_enabled', 'createdAt'],
            include: [
                {
                    model: LoginAttempt,
                    attributes: ['status', 'risk_score', 'createdAt'],
                    limit: 1,
                    order: [['createdAt', 'DESC']]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
    }
}

module.exports = AdminService;
