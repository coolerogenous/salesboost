const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    employee_id: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
        comment: '工号'
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('boss', 'staff'),
        defaultValue: 'staff'
    },
    points: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '积分总额'
    },
    avatar: {
        type: DataTypes.STRING(255),
        defaultValue: null
    }
}, {
    tableName: 'users'
});

module.exports = User;
