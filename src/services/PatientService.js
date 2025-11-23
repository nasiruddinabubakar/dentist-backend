const patientRepository = require('../repositories/PatientRepository');

class PatientService {
  async getPatients(clinicId) {
    return patientRepository.findByClinicId(clinicId, {
      order: [['createdAt', 'DESC']]
    });
  }

  async getPatientById(id, clinicId) {
    const patient = await patientRepository.findById(id);
    if (!patient) {
      throw new Error('Patient not found');
    }
    if (patient.clinicId !== clinicId) {
      throw new Error('Unauthorized access to patient');
    }
    return patient;
  }

  async createPatient(data) {
    return patientRepository.create(data);
  }

  async updatePatient(id, data, clinicId) {
    const patient = await this.getPatientById(id, clinicId);
    return patientRepository.update(id, data);
  }

  async deletePatient(id, clinicId) {
    const patient = await this.getPatientById(id, clinicId);
    return patientRepository.delete(id);
  }
}

module.exports = new PatientService();

