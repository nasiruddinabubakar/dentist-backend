const BaseRepository = require('./BaseRepository');
const { Appointment } = require('../models');

class AppointmentRepository extends BaseRepository {
  constructor() {
    super(Appointment);
  }

  async findByClinicId(clinicId, options = {}) {
    return this.findAll({
      ...options,
      where: { ...options.where, clinicId },
      include: options.include || [
        { association: 'patient' },
        { association: 'service' }
      ]
    });
  }

  async findByPatientId(patientId, options = {}) {
    return this.findAll({
      ...options,
      where: { ...options.where, patientId }
    });
  }
}

module.exports = new AppointmentRepository();

