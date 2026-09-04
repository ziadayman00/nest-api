require('dotenv').config();

const databaseConfig = (database) => ({
  ...(process.env.NODE_ENV === 'production' && process.env.DATABASE_URL && { use_env_variable: 'DATABASE_URL' }),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: 'postgres',
  logging: false,
  ...(process.env.DB_SSL === 'true' && { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } }),
});

module.exports = {
  development: databaseConfig(process.env.DB_NAME),
  test: databaseConfig(process.env.DB_TEST_NAME),
  production: databaseConfig(process.env.DB_NAME),
};
