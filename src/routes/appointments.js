const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/AppointmentController');
const { authenticate } = require('../middlewares/auth');

router.get('/', authenticate, appointmentController.getAppointments);
router.post('/', authenticate, appointmentController.createAppointment);
router.put('/:id', authenticate, appointmentController.updateAppointment);
router.delete('/:id', authenticate, appointmentController.deleteAppointment);

module.exports = router;

