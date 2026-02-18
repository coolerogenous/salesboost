const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    image_url: {
        type: DataTypes.STRING(255),
        comment: '任务配图路径'
    },
    reward_points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '奖励积分'
    },
    deadline: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.ENUM('active', 'closed'),
        defaultValue: 'active'
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'tasks'
});

module.exports = Task;
