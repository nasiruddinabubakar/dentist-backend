const BaseRepository = require('./BaseRepository');
const { Service } = require('../models');

class ServiceRepository extends BaseRepository {
  constructor() {
    super(Service);
  }

  async findByClinicId(clinicId, options = {}) {
    return this.findAll({
      ...options,
      where: { ...options.where, clinicId }
    });
  }
}

module.exports = new ServiceRepository();

