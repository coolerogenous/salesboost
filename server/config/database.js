const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

const envPath = path.resolve(__dirname, `../.env.${process.env.NODE_ENV || 'development'}`);
if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
} else {
    require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
}

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        timezone: '+08:00',
        define: {
            timestamps: true,
            underscored: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

module.exports = sequelize;
