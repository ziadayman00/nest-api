const deliveryZoneService = require('../services/delivery-zone.service');

const listPublicDeliveryZones = async (req, res) => res.status(200).json({ status: 'success', data: { zones: await deliveryZoneService.listPublicDeliveryZones() } });
const createDeliveryZone = async (req, res) => res.status(201).json({ status: 'success', data: { zone: await deliveryZoneService.createDeliveryZone(req.body) } });
const listDeliveryZones = async (req, res) => res.status(200).json({ status: 'success', data: { zones: await deliveryZoneService.listDeliveryZones() } });
const updateDeliveryZone = async (req, res) => res.status(200).json({ status: 'success', data: { zone: await deliveryZoneService.updateDeliveryZone(req.params.id, req.body) } });
const deactivateDeliveryZone = async (req, res) => { await deliveryZoneService.deactivateDeliveryZone(req.params.id); return res.status(204).send(); };

module.exports = { listPublicDeliveryZones, createDeliveryZone, listDeliveryZones, updateDeliveryZone, deactivateDeliveryZone };
