const { query } = require('express-validator');
const { validateRequest } = require('./auth.validator');

const analyticsQueryValidator = [
  query('from').optional().isISO8601().withMessage('from must be an ISO-8601 date'),
  query('to').optional().isISO8601().withMessage('to must be an ISO-8601 date'),
  validateRequest,
];

module.exports = { analyticsQueryValidator };
