require('dotenv').config();
const { validateEnvironment } = require('./config/env');
const app = require('./app');
const sequelize = require('./config/db');

const port = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    validateEnvironment();
    await sequelize.authenticate();
    console.log('Database connection is established.');

    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`);
    });

    const shutdown = (signal) => {
      console.log(signal + ' received. Closing server.');
      server.close(async () => {
        await sequelize.close();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

startServer();
