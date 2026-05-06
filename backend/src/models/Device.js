const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Device = sequelize.define('Device', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    device_fingerprint: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    device_name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    browser: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    os: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    user_agent: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    screen_resolution: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    timezone: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    is_trusted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    last_used_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'devices',
    timestamps: true,
    underscored: true
});

module.exports = Device;
