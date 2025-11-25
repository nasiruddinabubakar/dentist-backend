const doctorRepository = require('../repositories/DoctorRepository');

class DoctorService {
  async getDoctors(clinicId) {
    return doctorRepository.findByClinicId(clinicId, {
      order: [['createdAt', 'DESC']]
    });
  }

  async getDoctorById(id, clinicId) {
    const doctor = await doctorRepository.findById(id);
    if (!doctor) {
      throw new Error('Doctor not found');
    }
    if (doctor.clinicId !== clinicId) {
      throw new Error('Unauthorized access to doctor');
    }
    return doctor;
  }

  async createDoctor(data) {
    return doctorRepository.create(data);
  }

  async updateDoctor(id, data, clinicId) {
    const doctor = await this.getDoctorById(id, clinicId);
    return doctorRepository.update(id, data);
  }

  async deleteDoctor(id, clinicId) {
    const doctor = await this.getDoctorById(id, clinicId);
    return doctorRepository.delete(id);
  }
}

module.exports = new DoctorService();

