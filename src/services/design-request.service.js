const { DesignRequest, DesignRequestImage, DesignRequestNote, User } = require('../models');
const AppError = require('../utils/app-error');
const getPagination = require('../utils/pagination');
const notificationService = require('./notification.service');

const includes = [{ model: DesignRequestImage, as: 'images' }];
const create = async (userId, data, files) => {
  const request = await DesignRequest.create({ ...data, userId });
  if (files?.length) {
    await DesignRequestImage.bulkCreate(files.map((file) => ({
      designRequestId: request.id,
      url: file.path,
    })));
  }
  await notificationService.notifyAdmins({ type: 'new_design_request', title: 'New design request', message: request.fullName + ' submitted an interior-design request.', entityType: 'design_request', entityId: request.id }, {});
  return DesignRequest.findByPk(request.id, { include: includes });
};
const listMine = (userId) => DesignRequest.findAll({ where: { userId }, include: includes, order: [['createdAt', 'DESC']] });
const listAll = async (query) => {
  const { page, limit, offset } = getPagination(query);
  const where = query.status ? { status: query.status } : {};
  const { count, rows } = await DesignRequest.findAndCountAll({ where, include: [...includes, { model: User, as: 'user', attributes: ['id', 'fullName', 'email'] }], order: [['createdAt', 'DESC']], limit, offset, distinct: true });
  return { requests: rows, pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) } };
};
const updateStatus = async (id, status) => {
  const request = await DesignRequest.findByPk(id, { include: includes });
  if (!request) throw new AppError('Design request not found', 404);
  const statusChanged = request.status !== status;
  await request.update({ status });
  if (statusChanged && request.userId) {
    await notificationService.createForUser(request.userId, { type: 'design_request_status_changed', title: 'Design request updated', message: 'Your design request is now ' + status.replaceAll('_', ' ') + '.', entityType: 'design_request', entityId: request.id, metadata: { status } });
  }
  return request;
};
const addNote = async (id, adminId, body) => {
  if (!await DesignRequest.findByPk(id)) throw new AppError('Design request not found', 404);
  return DesignRequestNote.create({ designRequestId: id, adminId, body });
};
module.exports = { create, listMine, listAll, updateStatus, addNote };
