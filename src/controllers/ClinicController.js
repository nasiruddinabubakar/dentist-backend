const clinicService = require('../services/ClinicService');

class ClinicController {
  async getClinic(req, res, next) {
    try {
      const clinicId = req.user.clinicId || req.params.id;
      if (!clinicId) {
        return res.status(400).json({ error: 'clinicId is required' });
      }
      const clinic = await clinicService.getClinicById(clinicId);
      res.json(clinic);
    } catch (error) {
      next(error);
    }
  }

  async updateClinic(req, res, next) {
    try {
      const clinicId = req.user.clinicId || req.params.id;
      if (!clinicId) {
        return res.status(400).json({ error: 'clinicId is required' });
      }
      const clinic = await clinicService.updateClinic(clinicId, req.body);
      res.json(clinic);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ClinicController();

