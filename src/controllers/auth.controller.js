const authService = require('../services/auth.service');

const register = async (req, res) => {
  const user = await authService.register(req.body);

  return res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
};

const login = async (req, res) => {
  const result = await authService.login(req.body);
  return res.status(200).json({ status: 'success', data: result });
};

const getCurrentUser = async (req, res) => res.status(200).json({
  status: 'success',
  data: { user: req.user },
});

module.exports = {
  register,
  login,
  getCurrentUser,
};
