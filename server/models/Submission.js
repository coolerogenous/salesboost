const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Submission = sequelize.define('Submission', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    task_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        comment: '提交内容/说明'
    },
    image_url: {
        type: DataTypes.STRING(255),
        comment: '提交的图片'
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    reject_reason: {
        type: DataTypes.STRING(500),
        comment: '驳回理由'
    },
    reviewed_at: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'submissions'
});

module.exports = Submission;
