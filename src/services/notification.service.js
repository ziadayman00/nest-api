const { Notification, User } = require('../models');
const AppError = require('../utils/app-error');
const getPagination = require('../utils/pagination');

const createForUser = (userId, data, options = {}) => Notification.create({ userId, ...data }, options);
const notifyAdmins = async (data, options = {}) => {
  const admins = await User.findAll({ where: { role: 'admin', isActive: true }, attributes: ['id'], transaction: options.transaction });
  if (!admins.length) return [];
  return Notification.bulkCreate(admins.map((admin) => ({ userId: admin.id, ...data })), options);
};
const listMine = async (userId, query) => {
  const { page, limit, offset } = getPagination(query);
  const where = { userId };
  if (query.unreadOnly === 'true') where.readAt = null;
  const { count, rows } = await Notification.findAndCountAll({ where, limit, offset, order: [['createdAt', 'DESC']] });
  const unreadCount = await Notification.count({ where: { userId, readAt: null } });
  const notifications = rows.map((n) => {
    const plain = n.toJSON ? n.toJSON() : { ...n };
    return {
      ...plain,
      isRead: Boolean(plain.readAt),
    };
  });
  return { notifications, unreadCount, pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) } };
};
const markRead = async (userId, notificationId) => {
  const notification = await Notification.findOne({ where: { id: notificationId, userId } });
  if (!notification) throw new AppError('Notification not found', 404);
  if (!notification.readAt) await notification.update({ readAt: new Date() });
  const plain = notification.toJSON ? notification.toJSON() : { ...notification };
  return { ...plain, isRead: true };
};
const markAllRead = (userId) => Notification.update({ readAt: new Date() }, { where: { userId, readAt: null } });

module.exports = { createForUser, notifyAdmins, listMine, markRead, markAllRead };
