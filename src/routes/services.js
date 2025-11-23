const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/ServiceController');
const { authenticate } = require('../middlewares/auth');

router.get('/', authenticate, serviceController.getServices);
router.post('/', authenticate, serviceController.createService);
router.put('/:id', authenticate, serviceController.updateService);
router.delete('/:id', authenticate, serviceController.deleteService);

module.exports = router;

