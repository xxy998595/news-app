const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'mysql',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    })
  : new Sequelize(
      process.env.MYSQLDATABASE || process.env.DB_NAME || 'news_app',
      process.env.MYSQLUSER || process.env.DB_USER || 'root',
      process.env.MYSQLPASSWORD || process.env.DB_PASS || 'password',
      {
        host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
        port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false,
        define: {
          charset: 'utf8mb4',
          collate: 'utf8mb4_unicode_ci'
        },
        dialectOptions: {
          charset: 'utf8mb4'
        }
      }
    );

module.exports = sequelize;
