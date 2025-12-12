const appointmentRepository = require('../repositories/AppointmentRepository');
const { Op } = require('sequelize');

class AppointmentService {
  async getAppointments(clinicId) {
    return appointmentRepository.findByClinicId(clinicId, {
      order: [['appointmentDate', 'ASC']],
      include: [
        { association: 'patient' },
        { association: 'service' },
        { association: 'doctor' },
        { association: 'surgeryRoom' }
      ]
    });
  }

  async getAppointmentById(id, clinicId) {
    const appointment = await appointmentRepository.findById(id, {
      include: [
        { association: 'patient' },
        { association: 'service' },
        { association: 'doctor' },
        { association: 'surgeryRoom' }
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

  async checkAppointmentConflict(data, excludeId = null) {
    const { appointmentDate, time, clinicId } = data;
    
    if (!appointmentDate || !time) {
      return false;
    }

    // Extract date part from appointmentDate (ignore time component)
    const dateOnly = new Date(appointmentDate);
    dateOnly.setHours(0, 0, 0, 0);
    const nextDay = new Date(dateOnly);
    nextDay.setDate(nextDay.getDate() + 1);

    // Build where clause with date range comparison
    const whereClause = {
      clinicId: clinicId,
      appointmentDate: {
        [Op.gte]: dateOnly,
        [Op.lt]: nextDay
      },
      time: time,
      status: {
        [Op.notIn]: ['cancelled', 'no-show'] // Exclude cancelled and no-show appointments
      }
    };

    // Exclude current appointment when updating
    if (excludeId) {
      whereClause.id = {
        [Op.ne]: excludeId
      };
    }

    const existingAppointment = await appointmentRepository.findOne({
      where: whereClause
    });

    return !!existingAppointment;
  }

  async createAppointment(data) {
    // Check for conflicts before creating
    const hasConflict = await this.checkAppointmentConflict(data);
    if (hasConflict) {
      throw new Error('An appointment already exists for the same date and time');
    }

    return appointmentRepository.create(data);
  }

  async updateAppointment(id, data, clinicId) {
    const appointment = await this.getAppointmentById(id, clinicId);
    
    // Check for conflicts before updating (if date or time is being changed)
    if (data.appointmentDate || data.time) {
      const updateData = {
        appointmentDate: data.appointmentDate || appointment.appointmentDate,
        time: data.time || appointment.time,
        clinicId: clinicId
      };
      
      const hasConflict = await this.checkAppointmentConflict(updateData, id);
      if (hasConflict) {
        throw new Error('An appointment already exists for the same date and time');
      }
    }

    return appointmentRepository.update(id, data);
  }

  async deleteAppointment(id, clinicId) {
    const appointment = await this.getAppointmentById(id, clinicId);
    return appointmentRepository.delete(id);
  }
}

module.exports = new AppointmentService();

