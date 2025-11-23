const BaseRepository = require('./BaseRepository');
const { User } = require('../models');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return this.findOne({ where: { email } });
  }

  async findByClinicId(clinicId) {
    return this.findAll({ where: { clinicId } });
  }
}

module.exports = new UserRepository();

