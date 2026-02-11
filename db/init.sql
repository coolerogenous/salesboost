-- 创建数据库
CREATE DATABASE IF NOT EXISTS salesboost DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE salesboost;

-- 1. 用户表 (白名单机制)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id VARCHAR(50) NOT NULL UNIQUE COMMENT '工号',
    username VARCHAR(50) NOT NULL COMMENT '姓名',
    password VARCHAR(255) NOT NULL COMMENT '加密后的密码',
    role ENUM('admin', 'employee') DEFAULT 'employee' COMMENT '角色: admin-管理员, employee-员工',
    openid VARCHAR(100) UNIQUE COMMENT '微信OpenID，用于免密登录',
    total_points INT DEFAULT 0 COMMENT '总积分',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. 任务表
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL COMMENT '任务标题',
    description TEXT COMMENT '任务详情/图文要求',
    reward_points INT DEFAULT 0 COMMENT '奖励积分',
    status ENUM('active', 'expired', 'draft') DEFAULT 'active' COMMENT '任务状态',
    end_time DATETIME COMMENT '截止时间',
    created_by INT COMMENT '发布人ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB;

-- 3. 任务提交表 (审核核心表)
CREATE TABLE IF NOT EXISTS submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL COMMENT '员工ID',
    task_id INT NOT NULL COMMENT '任务ID',
    image_url VARCHAR(500) NOT NULL COMMENT '截图地址',
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' COMMENT '审核状态',
    reject_reason VARCHAR(255) COMMENT '驳回理由',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL COMMENT '审核时间',
    reviewed_by INT COMMENT '审核人ID',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (task_id) REFERENCES tasks(id),
    FOREIGN KEY (reviewed_by) REFERENCES users(id)
) ENGINE=InnoDB;

-- 4. 积分流水表
CREATE TABLE IF NOT EXISTS point_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount INT NOT NULL COMMENT '分值变动',
    source ENUM('task_completion', 'admin_adjustment') DEFAULT 'task_completion' COMMENT '来源',
    reference_id INT COMMENT '关联ID (如submission_id)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- 预制管理员账号 (默认密码: 123456, 建议后续修改)
-- 注意：实际开发中应该使用 hash 后的密码
INSERT INTO users (staff_id, username, password, role) 
VALUES ('admin', '管理员', '123456', 'admin');
