const patientService = require('../services/PatientService');

class PatientController {
  async getPatients(req, res, next) {
    try {
      const clinicId = req.user.clinicId || req.query.clinicId;
      if (!clinicId) {
        return res.status(400).json({ error: 'clinicId is required' });
      }
      const patients = await patientService.getPatients(clinicId);
      res.json(patients);
    } catch (error) {
      next(error);
    }
  }

  async createPatient(req, res, next) {
    try {
      const patient = await patientService.createPatient(req.body);
      res.status(201).json(patient);
    } catch (error) {
      next(error);
    }
  }

  async updatePatient(req, res, next) {
    try {
      const { id } = req.params;
      const clinicId = req.user.clinicId;
      const patient = await patientService.updatePatient(id, req.body, clinicId);
      res.json(patient);
    } catch (error) {
      next(error);
    }
  }

  async deletePatient(req, res, next) {
    try {
      const { id } = req.params;
      const clinicId = req.user.clinicId;
      await patientService.deletePatient(id, clinicId);
      res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PatientController();

