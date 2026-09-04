const { Sequelize } = require('sequelize');

const useSsl = process.env.DB_SSL === 'true';
const useDatabaseUrl = process.env.NODE_ENV === 'production' && Boolean(process.env.DATABASE_URL);
const options = {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: Number(process.env.DB_PORT),
  logging: false,
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  ...(useSsl && { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } }),
};

const sequelize = useDatabaseUrl
  ? new Sequelize(process.env.DATABASE_URL, options)
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, options);

module.exports = sequelize;
