const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const AdminLog = sequelize.define('AdminLog', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    admin_id: {
        type: DataTypes.INTEGER,
        allowNull: true // Null if system generated
    },
    action: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    target_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    target_type: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    details: {
        type: DataTypes.JSON,
        allowNull: true
    },
    ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true
    }
}, {
    tableName: 'admin_logs',
    timestamps: true,
    updatedAt: false,
    underscored: true
});

module.exports = AdminLog;
