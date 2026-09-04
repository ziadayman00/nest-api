const analyticsService = require('../services/analytics.service');

const getOverview = async (req, res) => res.status(200).json({
  status: 'success',
  data: await analyticsService.getOverview(req.query),
});

module.exports = { getOverview };
