const BaseRepository = require('./BaseRepository');
const { Clinic } = require('../models');

class ClinicRepository extends BaseRepository {
  constructor() {
    super(Clinic);
  }

  async findByEmail(email) {
    return this.findOne({ where: { email } });
  }
}

module.exports = new ClinicRepository();

