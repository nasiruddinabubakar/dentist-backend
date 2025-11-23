const appointmentService = require('../services/AppointmentService');

class AppointmentController {
  async getAppointments(req, res, next) {
    try {
      const clinicId = req.user.clinicId || req.query.clinicId;
      if (!clinicId) {
        return res.status(400).json({ error: 'clinicId is required' });
      }
      const appointments = await appointmentService.getAppointments(clinicId);
      res.json(appointments);
    } catch (error) {
      next(error);
    }
  }

  async createAppointment(req, res, next) {
    try {
      const appointment = await appointmentService.createAppointment(req.body);
      res.status(201).json(appointment);
    } catch (error) {
      next(error);
    }
  }

  async updateAppointment(req, res, next) {
    try {
      const { id } = req.params;
      const clinicId = req.user.clinicId;
      const appointment = await appointmentService.updateAppointment(id, req.body, clinicId);
      res.json(appointment);
    } catch (error) {
      next(error);
    }
  }

  async deleteAppointment(req, res, next) {
    try {
      const { id } = req.params;
      const clinicId = req.user.clinicId;
      await appointmentService.deleteAppointment(id, clinicId);
      res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AppointmentController();

