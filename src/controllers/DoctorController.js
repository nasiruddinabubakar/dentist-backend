const doctorService = require('../services/DoctorService');

class DoctorController {
  async getDoctors(req, res, next) {
    try {
      const clinicId = req.user.clinicId || req.query.clinicId;
      if (!clinicId) {
        return res.status(400).json({ error: 'clinicId is required' });
      }
      const doctors = await doctorService.getDoctors(clinicId);
      res.json(doctors);
    } catch (error) {
      next(error);
    }
  }

  async createDoctor(req, res, next) {
    try {
      const doctor = await doctorService.createDoctor(req.body);
      res.status(201).json(doctor);
    } catch (error) {
      next(error);
    }
  }

  async updateDoctor(req, res, next) {
    try {
      const { id } = req.params;
      const clinicId = req.user.clinicId;
      const doctor = await doctorService.updateDoctor(id, req.body, clinicId);
      res.json(doctor);
    } catch (error) {
      next(error);
    }
  }

  async deleteDoctor(req, res, next) {
    try {
      const { id } = req.params;
      const clinicId = req.user.clinicId;
      await doctorService.deleteDoctor(id, clinicId);
      res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DoctorController();

