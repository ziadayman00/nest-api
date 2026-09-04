const service = require('../services/design-request.service');
const send = (res, data, status = 200) => res.status(status).json({ status: 'success', data });
const create = async (req, res) => send(res, { designRequest: await service.create(req.user.id, req.body, req.files) }, 201);
const listMine = async (req, res) => send(res, { designRequests: await service.listMine(req.user.id) });
const listAll = async (req, res) => send(res, await service.listAll(req.query));
const updateStatus = async (req, res) => send(res, { designRequest: await service.updateStatus(req.params.id, req.body.status) });
const addNote = async (req, res) => send(res, { note: await service.addNote(req.params.id, req.user.id, req.body.body) }, 201);
module.exports = { create, listMine, listAll, updateStatus, addNote };
