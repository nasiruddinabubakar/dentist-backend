const clinicRepository = require('../repositories/ClinicRepository');

class ClinicService {
  async getClinicById(id) {
    const clinic = await clinicRepository.findById(id);
    if (!clinic) {
      throw new Error('Clinic not found');
    }
    return clinic;
  }

  async updateClinic(id, data) {
    const clinic = await this.getClinicById(id);
    
    // Don't allow updating email as it's used for authentication
    const { email, ...updateData } = data;
    
    return clinicRepository.update(id, updateData);
  }
}

module.exports = new ClinicService();

