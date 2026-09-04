const express = require('express');
const controller = require('../controllers/notification.controller');
const authenticate = require('../middlewares/authenticate');
const { notificationIdValidator, listNotificationValidator } = require('../validators/notification.validator');

const router = express.Router();

router.use(authenticate);
router.get('/', listNotificationValidator, controller.listMine);
router.patch('/read-all', controller.markAllRead);
router.patch('/:id/read', notificationIdValidator, controller.markRead);

module.exports = router;
