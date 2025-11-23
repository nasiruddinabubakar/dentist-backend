const express = require('express');
const router = express.Router();
const patientController = require('../controllers/PatientController');
const { authenticate } = require('../middlewares/auth');

router.get('/', authenticate, patientController.getPatients);
router.post('/', authenticate, patientController.createPatient);
router.put('/:id', authenticate, patientController.updatePatient);
router.delete('/:id', authenticate, patientController.deletePatient);

module.exports = router;

