const express = require('express');
const controller = require('../controllers/design-request.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const upload = require('../config/upload');
const { createDesignRequestValidator, statusValidator, noteValidator } = require('../validators/design-request.validator');

const router = express.Router();
router.use(authenticate);
router.post('/', upload.array('images', 5), createDesignRequestValidator, controller.create);
router.get('/me', controller.listMine);
router.get('/', authorize('admin'), controller.listAll);
router.patch('/:id/status', authorize('admin'), statusValidator, controller.updateStatus);
router.post('/:id/notes', authorize('admin'), noteValidator, controller.addNote);
module.exports = router;
