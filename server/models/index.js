const sequelize = require('../config/database');
const User = require('./User');
const Task = require('./Task');
const Submission = require('./Submission');

// 关联关系
// 老板 -> 任务 (一对多)
User.hasMany(Task, { foreignKey: 'created_by', as: 'createdTasks' });
Task.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// 任务 -> 提交 (一对多)
Task.hasMany(Submission, { foreignKey: 'task_id', as: 'submissions' });
Submission.belongsTo(Task, { foreignKey: 'task_id', as: 'task' });

// 员工 -> 提交 (一对多)
User.hasMany(Submission, { foreignKey: 'user_id', as: 'submissions' });
Submission.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
    sequelize,
    User,
    Task,
    Submission
};
