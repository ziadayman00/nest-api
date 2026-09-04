const notificationService = require('../services/notification.service');

const listMine = async (req, res) => res.status(200).json({ status: 'success', data: await notificationService.listMine(req.user.id, req.query) });
const markRead = async (req, res) => res.status(200).json({ status: 'success', data: { notification: await notificationService.markRead(req.user.id, req.params.id) } });
const markAllRead = async (req, res) => {
  const [updatedCount] = await notificationService.markAllRead(req.user.id);
  return res.status(200).json({ status: 'success', data: { updatedCount } });
};

module.exports = { listMine, markRead, markAllRead };
