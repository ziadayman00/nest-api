const express = require('express');
const { rateLimit } = require('express-rate-limit');

const authController = require('../controllers/auth.controller');
const {
  registerValidator,
  loginValidator,
  validateRequest,
} = require('../validators/auth.validator');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({
    status: 'fail',
    data: { message: 'Too many authentication attempts. Try again later.' },
  }),
});

router.post(
  '/register',
  authRateLimit,
  registerValidator,
  validateRequest,
  authController.register,
);

router.post('/login', authRateLimit, loginValidator, validateRequest, authController.login);
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;
