const express = require('express');
const controller = require('../controllers/delivery-zone.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { createDeliveryZoneValidator, updateDeliveryZoneValidator, zoneIdValidator } = require('../validators/delivery-zone.validator');

const router = express.Router();

router.get('/delivery-zones', controller.listPublicDeliveryZones);
router.post('/admin/delivery-zones', authenticate, authorize('admin'), createDeliveryZoneValidator, controller.createDeliveryZone);
router.get('/admin/delivery-zones', authenticate, authorize('admin'), controller.listDeliveryZones);
router.patch('/admin/delivery-zones/:id', authenticate, authorize('admin'), updateDeliveryZoneValidator, controller.updateDeliveryZone);
router.delete('/admin/delivery-zones/:id', authenticate, authorize('admin'), zoneIdValidator, controller.deactivateDeliveryZone);

module.exports = router;
