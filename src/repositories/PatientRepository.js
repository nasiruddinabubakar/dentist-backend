const BaseRepository = require('./BaseRepository');
const { Patient } = require('../models');

class PatientRepository extends BaseRepository {
  constructor() {
    super(Patient);
  }

  async findByClinicId(clinicId, options = {}) {
    return this.findAll({
      ...options,
      where: { ...options.where, clinicId }
    });
  }
}

module.exports = new PatientRepository();

