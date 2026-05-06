const AdminService = require('../services/adminService');
const { User, Device } = require('../models');

/**
 * Controller for Administrative actions
 */
exports.getDashboardStats = async (req, res, next) => {
    try {
        const stats = await AdminService.getSecurityStats();
        const alertingLogs = await AdminService.getSecurityAlerts();

        res.status(200).json({
            success: true,
            data: {
                stats,
                recentAlerts: alertingLogs
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getUsers = async (req, res, next) => {
    try {
        const users = await AdminService.getUsersOverview();
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

exports.toggleUserStatus = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { isActive } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await user.update({ is_active: isActive });

        res.status(200).json({
            success: true,
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
        });
    } catch (error) {
        next(error);
    }
};

exports.getUserSecurityDetails = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId, {
            attributes: ['id', 'email', 'full_name', 'role', 'is_active', 'mfa_enabled']
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const devices = await Device.findAll({ where: { user_id: userId } });
        const attempts = await sequelize.models.LoginAttempt.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']],
            limit: 50
        });

        res.status(200).json({
            success: true,
            data: {
                user,
                devices,
                loginHistory: attempts
            }
        });
    } catch (error) {
        next(error);
    }
};
