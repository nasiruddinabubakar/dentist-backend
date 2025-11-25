const BaseRepository = require('./BaseRepository');
const { Doctor } = require('../models');

class DoctorRepository extends BaseRepository {
  constructor() {
    super(Doctor);
  }

  async findByClinicId(clinicId, options = {}) {
    return this.findAll({
      ...options,
      where: { ...options.where, clinicId }
    });
  }
}

module.exports = new DoctorRepository();

