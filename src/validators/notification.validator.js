const { param, query } = require('express-validator');
const { validateRequest } = require('./auth.validator');

const notificationIdValidator = [param('id').isUUID(), validateRequest];
const listNotificationValidator = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('unreadOnly').optional().isBoolean(),
  validateRequest,
];

module.exports = { notificationIdValidator, listNotificationValidator };
