const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/DoctorController');
const { authenticate } = require('../middlewares/auth');

router.get('/', authenticate, doctorController.getDoctors);
router.post('/', authenticate, doctorController.createDoctor);
router.put('/:id', authenticate, doctorController.updateDoctor);
router.delete('/:id', authenticate, doctorController.deleteDoctor);

module.exports = router;

