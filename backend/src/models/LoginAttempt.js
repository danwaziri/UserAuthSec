const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const LoginAttempt = sequelize.define('LoginAttempt', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    device_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ip_address: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    country: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true
    },
    risk_score: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    risk_level: {
        type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
        defaultValue: 'LOW'
    },
    status: {
        type: DataTypes.ENUM('success', 'failed', 'blocked', 'mfa_required'),
        allowNull: false
    },
    failure_reason: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    mfa_required: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    mfa_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'login_attempts',
    timestamps: true,
    createdAt: 'attempted_at',
    updatedAt: false,
    underscored: true
});

module.exports = LoginAttempt;
