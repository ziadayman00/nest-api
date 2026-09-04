const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('./config/db');

const apiRouter = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map((origin) => origin.trim()).filter(Boolean);

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || process.env.NODE_ENV !== 'production' || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS'));
  },
}));
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', data: { message: 'NEST server is running' } });
});
app.get('/health', async (req, res, next) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ status: 'success', data: { service: 'nest-api', database: 'connected' } });
  } catch (error) {
    next(error);
  }
});

app.use('/api/v1', apiRouter);

app.use(notFound);

app.use(errorHandler);

module.exports = app;
