const appointmentRepository = require('../repositories/AppointmentRepository');

class AppointmentService {
  async getAppointments(clinicId) {
    return appointmentRepository.findByClinicId(clinicId, {
      order: [['appointmentDate', 'ASC']]
    });
  }

  async getAppointmentById(id, clinicId) {
    const appointment = await appointmentRepository.findById(id, {
      include: [
        { association: 'patient' },
        { association: 'service' }
      ]
    });
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    if (appointment.clinicId !== clinicId) {
      throw new Error('Unauthorized access to appointment');
    }
    return appointment;
  }

  async createAppointment(data) {
    return appointmentRepository.create(data);
  }

  async updateAppointment(id, data, clinicId) {
    const appointment = await this.getAppointmentById(id, clinicId);
    return appointmentRepository.update(id, data);
  }

  async deleteAppointment(id, clinicId) {
    const appointment = await this.getAppointmentById(id, clinicId);
    return appointmentRepository.delete(id);
  }
}

module.exports = new AppointmentService();

