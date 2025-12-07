const express = require('express');
const router = express.Router();
const clinicController = require('../controllers/ClinicController');
const { authenticate } = require('../middlewares/auth');

// Get clinic details
router.get('/', authenticate, clinicController.getClinic);

// Update clinic details
router.put('/', authenticate, clinicController.updateClinic);

module.exports = router;

